import pandas as pd
import sqlite3
from yd_pipeline.utils import (
    check_columns_exist,
    detect_delimiter,
)
from typing import BinaryIO


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
    