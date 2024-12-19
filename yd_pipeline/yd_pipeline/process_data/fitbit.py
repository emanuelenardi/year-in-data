import json
import os
import pandas as pd
import sqlite3
from yd_pipeline.utils import validate_columns


def extract_sleep_data(folder_path: str):
    """Extract sleep data from files from the folder path. The files have the name format
    "sleep-YYYY-MM-DD.json".

    Parameters
    ----------
    folder_path : str
        Path to folder containing jsons with sleep data.
    """
    sleep_file_names = [f for f in os.listdir(folder_path) if f.startswith("sleep")]
    keys_to_keep = [ 
         "logId",
         "dateOfSleep",
         "startTime",
         "endTime",
         "duration",
         "minutesToFallAsleep",
         "minutesAsleep",
         "minutesAwake",
         "minutesAfterWakeup",
         "timeInBed",
         "efficiency",
    ]
    full_sleep_data = []
    for file_name in sleep_file_names:
        file_path = folder_path / file_name
        with open(file_path) as sleep_file:
            sleep_data_list = json.load(sleep_file)
            for data in sleep_data_list:
                filtered_data = {key: data[key] for key in keys_to_keep}
                full_sleep_data.append(filtered_data)
    
    sleep_df = pd.DataFrame(full_sleep_data)
    
    # Save raw table for future use
    connection = sqlite3.connect('data/output/year_in_data.db')
    sleep_df.to_sql('fitbit_sleep_data_raw', connection, if_exists='replace')


def transform_sleep_data(sleep_df: pd.DataFrame):
    """Apply transformations to sleep dataframe, then saves dataframe in table:
    `year_in_data.fitbit_sleep_data_processed`
    
    Parameters
    ----------
    sleep_df : pd.DataFrame
        Raw Fibit sleep dataframe containing columns: 
            `["dateOfSleep", "startTime", "endTime", "duration"]`
    
    """
    # Select only important data for current analysis
    columns_to_keep = [
        "dateOfSleep",
        "startTime",
        "endTime",
        "duration"
    ]
    validate_columns(sleep_df, columns_to_keep)
    sleep_df = sleep_df[columns_to_keep]
    sleep_df = sleep_df.rename(columns={
        "dateOfSleep": "date",
        "startTime": "start_time",
        "endTime": "end_time",
        "duration": "total_duration"
    })
    sleep_df["total_duration_hours"] = (
        sleep_df["total_duration"]
        .apply(lambda x: round(x /(1000 * 60 * 60 ), 2))
    )
    sleep_df = sleep_df.drop(columns=["total_duration"])
    connection = sqlite3.connect('data/output/year_in_data.db')
    sleep_df.to_sql('fitbit_sleep_data_processed', connection, if_exists="replace")
    
    
def process_sleep_data(folder_path: str):
    """Wrapper function for process fitbit sleep data given folder containing sleep data
    jsons.
    
    The function first extracts the data into a table then transforms it into another t
    able.

    Parameters
    ----------
    folder_path : str
        Path to folder containing sleep data json files.
    """
    extract_sleep_data(folder_path)
    connection = sqlite3.connect('data/output/year_in_data.db')
    sleep_df = pd.read_sql_query("SELECT * FROM fitbit_sleep_data_raw", con=connection)
    transform_sleep_data(sleep_df)