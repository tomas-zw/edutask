import pytest
import unittest.mock as mock

from src.controllers.usercontroller import UserController


@pytest.fixture
def sut(return_value: list):
    """ fixture """
    mockedDao = mock.MagicMock()
    mockedDao.find.return_value = return_value
    mockedSut = UserController(dao = mockedDao)
    return mockedSut

@pytest.mark.tz
@pytest.mark.parametrize("return_value", [[{id: 1}]])
def test_playground_invalid(sut, return_value):
    with pytest.raises(ValueError):
        assert sut.get_user_by_email("notvalid.email.com")

@pytest.mark.tz
@pytest.mark.parametrize("return_value", [[{id: 1}]])
def test_playground_one_match(sut, return_value):
    result = sut.get_user_by_email("test@email.com")
    assert result == {id: 1}

@pytest.mark.tz
@pytest.mark.parametrize("return_value", [[{id: 1}, {id: 2}]])
def test_playground_two_match(sut, return_value):
    result = sut.get_user_by_email("test@email.com")
    assert result == {id: 1}