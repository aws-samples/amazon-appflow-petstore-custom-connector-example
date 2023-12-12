import { Stack, StackProps } from "aws-cdk-lib";
import { CfnConnectorProfile } from "aws-cdk-lib/aws-appflow";
import { Construct } from "constructs";

export interface PetStoreConnectorConsumerStackProps extends StackProps {
    readonly petStoreApiUrl: string;
}

export class PetStoreConnectorConsumerStack extends Stack {
    constructor(scope: Construct, id: string, props: PetStoreConnectorConsumerStackProps) {
        super(scope, id, props);

        new CfnConnectorProfile(this, 'petstore-connector-profile-1', {
            connectorProfileName: 'petstore-connection-1',
            connectorType: 'CustomConnector',
            connectorLabel: 'PetStore',
            connectionMode: 'Public',
            connectorProfileConfig: {
                connectorProfileProperties: {
                    customConnector: {
                        profileProperties: {
                            SERVER_URL: props.petStoreApiUrl
                        }
                    }
                },
                connectorProfileCredentials: {
                    customConnector: {
                        authenticationType: 'CUSTOM',
                        custom: {
                            customAuthenticationType: 'testType',
                            credentialsMap: {
                                testKey: 'foo'
                            }
                        }
                    }
                }
            }
        });
    }
}