from yd_pipeline.process_data import (
    process_strong_data,
    process_kindle_data,
    process_github_data
)
from pathlib import Path
import os
from dotenv import load_dotenv

root_dir = Path(__file__).resolve().parent

data_file_path = root_dir / "data" / "input"

# ETL strong data
strong_data_filepath = data_file_path / "strong266140424475682467.csv"
with open(strong_data_filepath) as strong_csv:
    process_strong_data(strong_csv)

# ETL kindle data
kindle_data_filepath = (
    data_file_path
    / "Kindle"
    / "Kindle.ReadingInsights"
    / "datasets"
    / "Kindle.reading-insights-sessions_with_adjustments"
    / "Kindle.reading-insights-sessions_with_adjustments.csv"
)
with open(kindle_data_filepath) as kindle_csv:
    process_kindle_data(kindle_csv)

# ETL github data
# I WILL NOT COMMIT MY GITHUB TOKEN TO GIT.
# I WILL NOT COMMIT MY GITHUB TOKEN TO GIT.
# I WILL NOT COMMIT MY GITHUB TOKEN TO GIT.
# I WILL NOT COMMIT MY GITHUB TOKEN TO GIT.
# I WILL NOT COMMIT MY GITHUB TOKEN TO GIT.
load_dotenv()
process_github_data("aebel-shajan", os.getenv("GITHUB_TOKEN"))