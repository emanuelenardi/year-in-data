from yd_pipeline.utils import (
    parse_duration,
    check_columns_exist
)
import pandas as pd

class TestParseDuration:
    """Test function parse_duration"""

    def test_expected(self):
        input_value = "10h 10m"
        expected_output = 610000.0
        assert parse_duration(input_value) == expected_output

    def test_hours_only(self):
        input_value = "5h"
        expected_output = 300000.0
        assert parse_duration(input_value) == expected_output

    def test_minutes_only(self):
        input_value = "30m"
        expected_output = 30000.0
        assert parse_duration(input_value) == expected_output

    def test_invalid_format(self):
        input_value = "5hours 30minutes"
        try:
            parse_duration(input_value)
            assert False, "Expected ValueError"
        except ValueError:
            pass

    def test_empty_string(self):
        input_value = ""
        try:
            parse_duration(input_value)
            assert False, "Expected ValueError"
        except ValueError:
            pass

    def test_invalid_numeric(self):
        input_value = "5h 30x"
        try:
            parse_duration(input_value)
            assert False, "Expected ValueError"
        except ValueError:
            pass

class TestCheckColumnsExist:

    def test_expected(self):
        input_df = pd.DataFrame(data={
            "A": [1, 2, 3],
            "B": [4, 5, 6],
            "C": [7, 8, 9],
            "D": [10, 11, 12]
        })
        positive_check = check_columns_exist(input_df, ["A", "B"])
        negative_check = check_columns_exist(input_df, ["E", "F", "A", "B"])
        assert positive_check == True
        assert negative_check == False