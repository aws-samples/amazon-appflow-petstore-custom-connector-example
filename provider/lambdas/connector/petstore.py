import json
import requests as http
from custom_connector_sdk.connector import auth
from custom_connector_sdk.connector import configuration
from custom_connector_sdk.connector import fields
from custom_connector_sdk.connector import settings
from custom_connector_sdk.lambda_handler import requests
from custom_connector_sdk.lambda_handler import responses
from custom_connector_sdk.connector import context as connector_context
from custom_connector_sdk.lambda_handler.lambda_handler import (BaseLambdaConnectorHandler, ConfigurationHandler,
                                                                RecordHandler, MetadataHandler)

SERVER_URL_SETTINGS_NAME = "SERVER_URL"
SERVER_URL_DESCRIPTION = "Server URL of the PetStore API"

CONNECTOR_OWNER = "Max Mustermann"
CONNECTOR_NAME = "PetstoreConnector"
CONNECTOR_VERSION = "0.1"

API_VERSION = "v0.1"


class PetstoreConfigurationHandler(ConfigurationHandler):

    def validate_credentials(self, request: requests.ValidateCredentialsRequest) -> \
            responses.ValidateCredentialsResponse:
        return responses.ValidateCredentialsResponse(is_success=True)

    def describe_connector_configuration(self, request: requests.DescribeConnectorConfigurationRequest) -> \
            responses.DescribeConnectorConfigurationResponse:
        connector_modes = [configuration.ConnectorModes.SOURCE]

        connector_runtime_settings = [
            settings.ConnectorRuntimeSetting(
                key=SERVER_URL_SETTINGS_NAME,
                data_type=settings.ConnectorRuntimeSettingDataType.String,
                required=True,
                label=SERVER_URL_DESCRIPTION,
                description=SERVER_URL_DESCRIPTION,
                scope=settings.ConnectorRuntimeSettingScope.CONNECTOR_PROFILE
            )
        ]

        authentication_config = auth.AuthenticationConfig(
            is_oauth_2_supported=False, o_auth_2_defaults=None,
            is_custom_auth_supported=True,
            custom_auth_config=[
                auth.CustomAuthConfig(authentication_type="testType",
                                      auth_parameters=[auth.AuthParameter(key='testKey',
                                                                          required=True,
                                                                          label='testLabel',
                                                                          description='testDescription',
                                                                          sensitive_field=True,
                                                                          connector_supplied_values=[
                                                                              'testValue'])])]
        )

        return responses.DescribeConnectorConfigurationResponse(
            is_success=True,
            connector_owner=CONNECTOR_OWNER,
            connector_name=CONNECTOR_NAME,
            connector_version=CONNECTOR_VERSION,
            connector_modes=connector_modes,
            connector_runtime_setting=connector_runtime_settings,
            authentication_config=authentication_config,
            supported_api_versions=[API_VERSION]
        )

    def validate_connector_runtime_settings(self, request: requests.ValidateConnectorRuntimeSettingsRequest) -> \
            responses.ValidateConnectorRuntimeSettingsResponse:
        return responses.ValidateConnectorRuntimeSettingsResponse(is_success=True)


class PetstoreRecordHandler(RecordHandler):
    entity_path_map = {
        "Pet": "pets"
    }

    def retrieve_data(self, request: requests.RetrieveDataRequest) -> responses.RetrieveDataResponse:
        raise Exception("Not implemented")

    def write_data(self, request: requests.WriteDataRequest) -> responses.WriteDataResponse:
        raise Exception("Not implemented")

    def query_data(self, request: requests.QueryDataRequest) -> responses.QueryDataResponse:
        if SERVER_URL_SETTINGS_NAME not in request.connector_context.connector_runtime_settings:
            return responses.QueryDataResponse(
                is_success=False,
                error_details=responses.ErrorDetails(
                    error_code=responses.ErrorCode.InvalidArgument,
                    error_message=f"Runtime setting {SERVER_URL_SETTINGS_NAME} not found"
                ),
            )

        entity_name = request.entity_identifier
        path = self.entity_path_map[entity_name]

        url = f"{request.connector_context.connector_runtime_settings[SERVER_URL_SETTINGS_NAME]}/{path}"
        records = []

        response = http.get(url=url, timeout=30)
        pets = response.json()

        for pet in pets:
            records.append(json.dumps(pet))

        return responses.QueryDataResponse(is_success=True, records=records)


class PetstoreMetadataHandler(MetadataHandler):
    pet_entity = connector_context.Entity(entity_identifier="Pet", label="Pet", has_nested_entities=False,
                                          description="Pet",
                                          is_writable=False)

    store_entity = connector_context.Entity(entity_identifier="Store", label="Store", has_nested_entities=False,
                                            description="Store", is_writable=False)

    def list_entities(self, request: requests.ListEntitiesRequest) -> responses.ListEntitiesResponse:

        return responses.ListEntitiesResponse(is_success=True, entities=[self.pet_entity])

    def describe_entity(self, request: requests.DescribeEntityRequest) -> responses.DescribeEntityResponse:
        entity = None
        entity_fields = []
        match request.entity_identifier:
            case 'Pet':
                entity = self.pet_entity

                id_field = connector_context.FieldDefinition(
                    field_name="id",
                    data_type=fields.FieldDataType.Integer,
                    data_type_label="Integer",
                    label="Id",
                    description="Id",
                    default_value="0",
                    is_primary_key=True,
                    read_properties=fields.ReadOperationProperty(is_queryable=True, is_retrievable=True),
                    write_properties=None
                )

                type_field = connector_context.FieldDefinition(
                    field_name="type",
                    data_type=fields.FieldDataType.String,
                    data_type_label="String",
                    label="Type",
                    description="Type",
                    default_value="dog",
                    is_primary_key=False,
                    read_properties=fields.ReadOperationProperty(is_queryable=True, is_retrievable=True),
                    write_properties=None
                )

                price_field = connector_context.FieldDefinition(
                    field_name="price",
                    data_type=fields.FieldDataType.Float,
                    data_type_label="Decimal",
                    label="Price",
                    description="Price",
                    default_value="0.0",
                    is_primary_key=False,
                    read_properties=fields.ReadOperationProperty(is_queryable=True, is_retrievable=True),
                    write_properties=None
                )

                entity_fields = [id_field, type_field, price_field]

            case _:
                return responses.DescribeEntityResponse(
                    is_success=False,
                    error_details=responses.ErrorDetails(error_code=responses.ErrorCode.ResourceNotFoundError,
                                                         error_message=f"Entity {request.entity_identifier} does not exists")
                )

        entity_definition = connector_context.EntityDefinition(
            entity=entity,
            fields=entity_fields
        )

        return responses.DescribeEntityResponse(
            is_success=True, entity_definition=entity_definition
        )


class PetStoreConnectorHandler(BaseLambdaConnectorHandler):
    def __init__(self):
        super().__init__(
            PetstoreMetadataHandler(),
            PetstoreRecordHandler(),
            PetstoreConfigurationHandler(),
        )


def lambda_handler(event, context):
    return PetStoreConnectorHandler().lambda_handler(event, context)
