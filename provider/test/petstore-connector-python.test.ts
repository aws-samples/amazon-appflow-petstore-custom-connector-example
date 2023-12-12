import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PetStoreConnectorStack } from '../lib/petstore-connector-stack';
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';


test('CDK Nag Test', () => {

    const app = new cdk.App();
    // Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
    Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
    new PetStoreConnectorStack(app, 'CdkTestStack', {
        petStoreConnectorName: 'PetStore',
        petStoreConnectorDescription: 'Petstore Custom Connector'
    })
})
