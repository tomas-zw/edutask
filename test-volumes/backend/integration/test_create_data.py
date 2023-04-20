import pytest
from unittest.mock import patch

from src.util.dao import DAO



validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["description"],
        "properties": {
            "description": {
                "bsonType": "string",
                "description": "the description of a todo must be determined",
                "uniqueItems": True
            }, 
            "done": {
                "bsonType": "bool"
            }
        }
    }
}

@pytest.fixture
# @patch ('src.util.validators', autospec=True)
# def sut(mockedValidators):
def sut():
    # mockedValidators.getValidator.return_value = validator
    with patch('src.util.dao.getValidator', return_value = validator):
        sut = DAO("test")
    # return sut
    yield sut
    sut.drop()

@pytest.mark.integration
def test_valid_data(sut):
    result = sut.create({"description": "a string", "done": True})
    print(result)
    assert "_id" in result