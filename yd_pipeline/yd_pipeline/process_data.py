import pandas as pd
import sqlite3
from yd_pipeline.utils import (
    check_columns_exist,
    parse_duration,
    detect_delimiter
)
from typing import BinaryIO

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
    
    # Parse durations to milliseconds
    strong_df["Workout Duration"] = strong_df["Workout Duration"].apply(parse_duration)
    
    # Calculate volume for each workout
    strong_df["Volume"] = strong_df["Weight"] * strong_df["Reps"]
    
    # Load pandas dataframe into sqlite table
    connection = sqlite3.connect('data/output/year_in_data.db')
    strong_df.to_sql('workout_data', connection, if_exists='replace')