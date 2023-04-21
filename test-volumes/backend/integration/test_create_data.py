import pytest
from unittest.mock import patch
import pymongo
from unittest import mock

from src.util.dao import DAO


# This fixture does not work
""" @pytest.fixture
@patch('src.util.dao.getValidator', autospec=True)
def sut(mockedgetvalidator):
    mockedgetvalidator.return_value = mock.MagicMock()
    mockedgetvalidator.return_value.get.return_value = validator
    sut = DAO("test")
    return sut
    #yield sut
    #sut.drop() """

validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["description"],
        "properties": {
            "description": {
                "bsonType": "string",
                "description": "the description",
                "uniqueItems": True
            },
            "done": {
                "bsonType": "bool"
            },
        }
    }
}

@pytest.fixture
def sut():
    """"Fixture for the integration tests"""""
    with patch('src.util.dao.getValidator', return_value = validator):
        sut = DAO("test")
    yield sut
    sut.drop()


@pytest.mark.integration
def test_valid_data(sut):
    result = sut.create({"description": "a string", "done": True})
    assert "_id" in result

@pytest.mark.integration
def test_non_complying_data(sut):
    with pytest.raises(pymongo.errors.WriteError):
        assert sut.create({"description": "another string", "done": "a string"})

@pytest.mark.integration
def test_missing_data(sut):
    with pytest.raises(pymongo.errors.WriteError):
        assert sut.create({"done": True})


@pytest.mark.integration
def test_non_unique_data(sut):
    with pytest.raises(pymongo.errors.WriteError):
        sut.create({"description": "a string", "done": True})
        assert sut.create({"description": "a string", "done": True})
