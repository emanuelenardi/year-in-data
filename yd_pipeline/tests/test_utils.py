from yd_pipeline.utils import parse_duration, check_columns_exist, detect_delimiter
import pandas as pd
import pytest


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
    """Test function check_columns_exist."""

    def test_expected(self):
        input_df = pd.DataFrame(
            data={"A": [1, 2, 3], "B": [4, 5, 6], "C": [7, 8, 9], "D": [10, 11, 12]}
        )
        positive_check = check_columns_exist(input_df, ["A", "B"])
        negative_check = check_columns_exist(input_df, ["E", "F", "A", "B"])
        assert positive_check == True
        assert negative_check == False


class TestDetectDelimiter:
    """Test function detect_delimiter."""

    @pytest.mark.parametrize(
        "filename, content, expected_delimiter",
        [
            ("comma.csv", "col1,col2,col3\n1,2,3\n4,5,6\n", ","),
            ("semicolon.csv", "col1;col2;col3\n1;2;3\n4;5;6\n", ";"),
            ("tab.csv", "col1\tcol2\tcol3\n1\t2\t3\n4\t5\t6\n", "\t"),
        ],
    )
    def test_expected(self, tmpdir, filename, content, expected_delimiter):
        # Note: tmpdir is an inbuilt fixture which allows creation of temprory files
        file_path = tmpdir.join(filename)
        with open(file_path, "w") as f:
            f.write(content)
        with open(file_path, "r") as f:
            assert detect_delimiter(f) == expected_delimiter
