import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PetStoreConnectorConsumerStack } from '../lib/petstore-connector-consumer-stack';
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';


test('CDK Nag Test', () => {

    const app = new cdk.App();
    // Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
    Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
    new PetStoreConnectorConsumerStack(app, 'CdkTestStack', {
        petStoreApiUrl: 'https://ok7nnlwjtk.execute-api.eu-central-1.amazonaws.com/dev'
    })
})
