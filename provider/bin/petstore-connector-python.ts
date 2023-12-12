#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PetStoreConnectorStack } from '../lib/petstore-connector-stack';

const app = new cdk.App();

const connectorStack = new PetStoreConnectorStack(app, 'petstore-connector', {
    petStoreConnectorName: 'PetStore',
    petStoreConnectorDescription: 'Petstore Custom Connector',
});