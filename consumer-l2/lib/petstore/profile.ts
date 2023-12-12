import { ConnectorProfileBase, ConnectorProfileProps } from "@cdklabs/cdk-appflow";
import { CfnConnectorProfile } from "aws-cdk-lib/aws-appflow";
import { Construct } from "constructs";
import { PetStoreConnectorType } from "./type";

export interface PetStoreConnectorProfileProps extends ConnectorProfileProps {
    readonly instanceUrl: string;
}

export class PetStoreConnectorProfile extends ConnectorProfileBase {

    public static fromConnectionProfileArn(scope: Construct, id: string, arn: string) {
        return this._fromConnectorProfileAttributes(scope, id, { arn }) as PetStoreConnectorProfile;
    }

    public static fromConnectionProfileName(scope: Construct, id: string, name: string) {
        return this._fromConnectorProfileAttributes(scope, id, { name }) as PetStoreConnectorProfile;
    }

    constructor(scope: Construct, id: string, props: PetStoreConnectorProfileProps) {
        super(scope, id, props, PetStoreConnectorType.instance);
    }

    protected buildConnectorProfileCredentials(_props: ConnectorProfileProps): CfnConnectorProfile.ConnectorProfileCredentialsProperty {
        return {
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

    protected buildConnectorProfileProperties(props: ConnectorProfileProps): CfnConnectorProfile.ConnectorProfilePropertiesProperty {
        const properties = (props as PetStoreConnectorProfileProps);

        return {
            customConnector: {
                profileProperties: {
                    SERVER_URL: properties.instanceUrl
                }
            }
        }
    }
}