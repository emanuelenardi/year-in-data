from yd_pipeline.utils import parse_duration

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