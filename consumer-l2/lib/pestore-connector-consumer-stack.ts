import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PetStoreApiVersion, PetStoreConnectorProfile, PetStoreSource } from './petstore';
import { Mapping, OnDemandFlow, S3Destination } from '@cdklabs/cdk-appflow';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export interface PetStoreConnectorConsumerStackProps extends StackProps {
  readonly petStoreApiUrl: string;
}

export class PetStoreConnectorConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: PetStoreConnectorConsumerStackProps) {
    super(scope, id, props);

    // 01 - Create a Connector Profile

    const profile = new PetStoreConnectorProfile(this, 'PetStoreConnectorProfile', {
      instanceUrl: props.petStoreApiUrl
    });

    // 02 - Create a Flow

    const source = new PetStoreSource({
      profile,
      object: 'Pet',
      apiVersion: PetStoreApiVersion.V01
    });

    const bucket = new Bucket(this, 'PetStoreBucket', {
      // NOTE: change these settings in real-life scenarios
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const destination = new S3Destination({
      location: { bucket },
    });

    const flow = new OnDemandFlow(this, 'PetStoreFlow', {
      source,
      destination,
      mappings: [Mapping.mapAll()]
    });
  }
}
