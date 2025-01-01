from unittest.mock import MagicMock
from facebook4 import Bd  # Assurez-vous que votre script s'appelle facebook4.py

def test_add_data(mocker):
    # Mock MongoDB collection
    mock_collection = MagicMock()
    mock_client = MagicMock()
    mock_client.__getitem__.return_value = {"apartments": mock_collection}

    # Créez une instance de Bd avec le mock
    bd = Bd(mock_client, "test_db", "apartments", "progress")

    # Ajoutez un document de test
    test_data = {"_id": "123", "name": "test_apartment"}
    bd.add_data(test_data)

    # Vérifiez que `insert_one` a été appelé avec le bon document
    mock_collection.insert_one.assert_called_once_with(test_data)
