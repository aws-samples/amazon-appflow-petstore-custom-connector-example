#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PetStoreConnectorConsumerStack } from '../lib/petstore-connector-consumer-stack';

const app = new cdk.App();
new PetStoreConnectorConsumerStack(app, 'petstore-connector-consumer-l1-stack', {
  petStoreApiUrl: 'https://ok7nnlwjtk.execute-api.eu-central-1.amazonaws.com/dev'
});