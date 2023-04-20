import pytest
import unittest.mock as mock
from src.controllers.usercontroller import UserController

# tests for the get_user_by_email method
@pytest.mark.lab1
def test_get_user_by_email_invalidEmail():
    with pytest.raises(ValueError):
        mockedDao = mock.MagicMock()
        mockedDao.find.return_value = [{id: 1}]
        sut = UserController(dao = mockedDao)
        assert sut.get_user_by_email("test.email.com")

@pytest.mark.lab1
def test_get_user_by_email_validEmailOneMatchingAccount():
    mockedDao = mock.MagicMock()
    mockedDao.find.return_value = [{id: 1}]
    sut = UserController(dao = mockedDao)
    result = sut.get_user_by_email("test@email.com")
    assert result == {id:1}

@pytest.mark.lab1
# How to test the error message?
def test_get_user_by_email_validEmailTwoMatchingAccountsReturnsUser():
    mockedDao = mock.MagicMock()
    mockedDao.find.return_value = [{id: 1}, {id: 2}]
    sut = UserController(dao = mockedDao)
    result = sut.get_user_by_email("test@email.com")
    assert result == {id: 1}

@pytest.mark.lab1
def test_get_user_by_email_validEmailTwoMatchingAccountsOutputsErrorMessage(capsys):
    mockedDao = mock.MagicMock()
    mockedDao.find.return_value = [{id: 1}, {id: 2}]
    sut = UserController(dao = mockedDao)
    _ = sut.get_user_by_email("test@email.com")
    captured = capsys.readouterr()
    assert str.__contains__(captured.out, "test@email.com")

@pytest.mark.lab1
def test_get_user_by_email_validEmailNoMatchingAccount():
    mockedDao = mock.MagicMock()
    mockedDao.find.return_value = []
    sut = UserController(dao = mockedDao)
    result = sut.get_user_by_email("test@email.com")
    assert result == None


@pytest.mark.lab1
def test_get_user_by_email_databaseError():
    with pytest.raises(Exception):
        mockedDao = mock.MagicMock()
        def returnException():
            raise Exception()
        mockedDao.find.side_effect = returnException
        sut = UserController(dao = mockedDao)
        assert sut.get_user_by_email("test@email.com")