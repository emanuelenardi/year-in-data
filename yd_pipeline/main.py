from yd_pipeline.process_strong_data import process_strong_data
from pathlib import Path

root_dir = Path(__file__).resolve().parent

data_file_path = root_dir / "data" / "input"
strong_data_filepath = data_file_path /  "strong266140424475682467.csv"
with open(strong_data_filepath) as strong_csv:
    process_strong_data(strong_csv)