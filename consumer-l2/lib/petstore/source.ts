import { ConnectorType, IFlow, ISource } from "@cdklabs/cdk-appflow";
import { CfnFlow } from "aws-cdk-lib/aws-appflow";
import { PetStoreConnectorType } from "./type";
import { PetStoreConnectorProfile } from "./profile";

export interface PetStoreSourceProps {
    readonly profile: PetStoreConnectorProfile
    readonly object: string;
    readonly apiVersion: string;
}

export class PetStoreSource implements ISource {

    public readonly connectorType: ConnectorType = PetStoreConnectorType.instance;

    constructor(private readonly props: PetStoreSourceProps) { }

    bind(scope: IFlow): CfnFlow.SourceFlowConfigProperty {
        scope.node.addDependency(this.props.profile);

        return {
            connectorType: this.connectorType.asProfileConnectorType,
            connectorProfileName: this.props.profile.name,
            apiVersion: this.props.apiVersion,
            sourceConnectorProperties: {
                customConnector: {
                    entityName: this.props.object
                }
            }
        }
    }
}