import pandas as pd
import sqlite3
from yd_pipeline.utils import (
    check_columns_exist,
    validate_columns,
    parse_duration,
    detect_delimiter,
    load_graphql_query
)
from typing import BinaryIO, TypedDict, List
import requests

def process_strong_data(csv_file: BinaryIO):
    """Read in the strong csv from the filepath.

    Parameters
    ----------
    csv_file : BinaryIO
        Csv file containing strong data
    """
    # Read in csv from config into a pandas dataframe
    strong_df= pd.read_csv(csv_file, delimiter=detect_delimiter(csv_file), parse_dates=['Date'])
    
    # The strong app has 2 different formats with different column names
    if "Duration" in strong_df:
        strong_df = strong_df.rename(columns={"Duration" : "Workout Duration"})
    
    columns_to_keep = [
        "Date",
        "Workout Name",
        "Exercise Name",
        "Set Order",
        "Weight",
        "Reps",
        "Distance",
        "Seconds",
        "Notes",
        "Workout Duration"
    ]
    if not check_columns_exist(strong_df, columns_to_keep):
        raise ValueError("CSV provided does not contain required columns.")
    
    # Select only columns to keep
    strong_df = strong_df[columns_to_keep]
    rename_map = {
        "Date": "date",
        "Workout Name": "workout_name",
        "Exercise Name": "exercise_name",
        "Set Order": "set_order",
        "Weight": "weight",
        "Reps": "reps",
        "Distance": "distance",
        "Seconds": "seconds",
        "Notes": "notes",
        "Workout Duration": "workout_duration",
    }
    strong_df = strong_df.rename(columns=rename_map)
    
    # Parse durations to milliseconds
    strong_df["workout_duration_milliseconds"] = strong_df["workout_duration"].apply(parse_duration)
    strong_df.drop(columns=["workout_duration"])
    
    # Calculate volume for each workout
    strong_df["volume"] = strong_df["weight"] * strong_df["reps"]
    
    # Store fine grain data in seperate table for future use
    connection = sqlite3.connect('data/output/year_in_data.db')
    strong_df.to_sql('workout_data_fine_grain', connection, if_exists='replace')

    # For daily info
    daily_columns = ["date", "workout_name", "workout_duration_milliseconds", "volume"]
    daily_strong_df = strong_df[daily_columns]
    daily_strong_df["date"] = pd.to_datetime(
        daily_strong_df["date"],
        format="ISO8601"
    ).dt.date
    daily_strong_df = (daily_strong_df
        .groupby(["date", "workout_name"])
        .aggregate({
            "workout_duration_milliseconds": "min",
            "volume": "sum"
        })
    )
    daily_strong_df["workout_duration_minutes"] = (
        daily_strong_df["workout_duration_milliseconds"]
        .apply(lambda x : x /(60 * 1000))
    )
    daily_strong_df = daily_strong_df.drop(columns=["workout_duration_milliseconds"])
    daily_strong_df.to_sql("workout_data_daily", connection, if_exists='replace')
    
    

def process_kindle_data(csv_file: BinaryIO):
    """
    Read in kindle data from csv file. 
    Store fine grain data in year_in_data.kindle_data_fine_grain.
    Store daily data in year_in_data.kindle_data_daily.

    Parameters
    ----------
    csv_file : BinaryIO
        Csv file containing kindle activity data. Has the following columns:
        [ASIN,end_time,reading_marketplace,start_time,total_reading_milliseconds]
    """
    
    # Read in csv from config into a pandas dataframe
    kindle_df= pd.read_csv(
        csv_file, 
        delimiter=detect_delimiter(csv_file), 
        parse_dates=["start_time", "end_time"]
    )
    
    columns_to_keep = [
        "ASIN",
        "end_time",
        "start_time",
        "total_reading_milliseconds"
    ]
    if not check_columns_exist(kindle_df, columns_to_keep):
        raise ValueError(
            "CSV provided does not contain required columns!\n"
            f"\t* CSV columns: {list(kindle_df.columns)}\n"
            f"\t* Required columns: {columns_to_keep}"
        )
    
    # Store fine grain data in seperate table for future use
    connection = sqlite3.connect('data/output/year_in_data.db')
    kindle_df.to_sql('kindle_data_fine_grain', connection, if_exists='replace')
    
    # For daily info
    daily_kindle_df = kindle_df[["ASIN", "start_time", "total_reading_milliseconds"]]
    daily_kindle_df["date"] = pd.to_datetime(
        daily_kindle_df["start_time"],
        format="ISO8601"
    ).dt.date
    daily_kindle_df = daily_kindle_df[["ASIN", "date", "total_reading_milliseconds"]]
    daily_kindle_df = daily_kindle_df.groupby(["ASIN", "date"]).sum()
    daily_kindle_df["total_reading_minutes"] = (
        daily_kindle_df["total_reading_milliseconds"]
        .apply(lambda x : round(x /(60 * 1000)))
    )
    daily_kindle_df = daily_kindle_df.drop(columns=["total_reading_milliseconds"])
    daily_kindle_df = daily_kindle_df[daily_kindle_df["total_reading_minutes"] != 0]
    daily_kindle_df.to_sql('kindle_data_daily', connection, if_exists='replace')
    
# TODO: Move this to a different file. Add tests too at some point.
class ContributionInfo(TypedDict):
    commitCount: int
    occurredAt: str
    repository_name: str
    
def unpack_contributions_dict(contributions_for_repo: dict) -> List[ContributionInfo]:
        """Unpacks contribution dicts obtained from the using a graphql query on github
        contribution activity.

        Parameters
        ----------
        contributions_for_repo : dict
            Has structure like:
            ```
            {
                "contributions": {
                    "nodes": [
                        {
                            "commitCount": int,
                            "occurredAt": str,
                            "repository": {
                                "name": str
                            }
                        }
                    ]
                }
            }
            ```

        Returns
        -------
        list[ContributionInfo]
            Has structure like:
            ```
            [
                {
                    commitCount: int
                    occurredAt: str
                    repository_name: str
                }
            ]
            ```
        """
        node_list = contributions_for_repo["contributions"]["nodes"]
        node_list = [{
            "commitCount": node["commitCount"],
            "occurredAt": node["occurredAt"],
            "repository_name": node["repository"]["name"] # these should all be the same :p
        } for node in node_list]
        return node_list

def process_github_data(github_username: str, github_token: str):
    """Using github username and github token, generate a table containing all repos and all commits.

    I used a graphql query to get only the commitCount for each repo in a given year.
    I used the explorer from here: "https://docs.github.com/en/graphql/overview/explorer"
    
    The structure of the response json has the format:
    ```
    {
       "data": {
            "user": {
                "contributionsCollection": {
                    "commitContributionsByRepository": RepoContribution[]
                }
            }
        }
    }
    ```
    where RepoContribution has structure like:
    ```
    {
        "contributions": {
            "nodes": [
                {
                    "commitCount": int,
                    "occurredAt": str,
                    "repository": {
                        "name": str
                    }
                }
            ]
        }
    }
    ```
    
    Parameters
    ----------
    github_username : str
        Username for github.com
    github_token : str
        Github token for corresponding user.
    """
    query = load_graphql_query("yd_pipeline/graphql/github_user_contributions.graphql")
    variables = {
            "username": github_username,
            "from": "2024-01-01T00:00:00Z",
            "to": "2024-12-31T23:59:59Z"
        }
    headers = {"Authorization": f"Bearer {github_token}"}
    repos_url = f"https://api.github.com/graphql"
    response = requests.post(
            repos_url,
            json={"query": query, "variables": variables},
            headers=headers,
        )
    if not response.ok:
        response.raise_for_status()
    
    response_json = response.json()
    contributions_by_repos = (
        response_json
        ["data"]
        ["user"]
        ["contributionsCollection"]
        ["commitContributionsByRepository"]
    )
    
    full_contribution_list = []
    for repo_contributions in contributions_by_repos:
        full_contribution_list.extend(unpack_contributions_dict(repo_contributions) )

    github_activity_df = pd.DataFrame(full_contribution_list)
    validate_columns(
        github_activity_df, 
        [
            "commitCount",
            "occurredAt",
            "repository_name"
        ]
    )
    github_activity_df = github_activity_df.rename(columns={
        "commitCount": "total_commits",
        "occurredAt": "date",
        "repository_name": "repository_name"
    })
    connection = sqlite3.connect('data/output/year_in_data.db')
    github_activity_df.to_sql('github_data_daily', connection, if_exists='replace')