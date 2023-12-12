# About PetStore Custom Connector for AppFlow

This repository contains a sample presenting how to use [Amazon AppFlow Custom Connector SDK for Python](https://github.com/awslabs/aws-appflow-custom-connector-python) with [AWS CDK](https://github.com/aws/aws-cdk) in order to implement, build and deploy an Amazon AppFlow custom connector using the *Infrastructure-as-Code* paradigm for repeatibility and immutability. 

The sample uses the [PetStore example API](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-from-example.html) and exposes it as a source application available from Amazon AppFlow. 

Additionally, the repository contains two samples showcasing how the Amazon AppFlow Custom Connector for PetStore can be consumed using AWS CDK.

The repository contains three subfolders:

- `provider` - with a complete code necessary to build and deploy the PetStore Custom Connector
- `consumer-l1` - with code showing how to create an Amazon AppFlow Connector Profile for the PetStore Custom Connector relying on the L1 constructs for Amazon AppFlow from the [aws-cdk](https://github.com/aws/aws-cdk) library.
- `consumer-l2` - with code showing how to create an Amazon AppFlow Connector Profile for the PetStore Custom Connector, Source and a Flow to Amazon S3 with the use of the [@cdklabs/cdk-appflow](https://github.com/cdklabs/cdk-appflow/) library providing L2 constructs for Amazon AppFlow.

## PetStore Provider

The code in the `provider/` directory is the implementation of an Amazon AppFlow Custom Connector for PetStore Example API with the use of [Amazon AppFlow Custom Connector SDK for Python](https://github.com/awslabs/aws-appflow-custom-connector-python). An Amazon AppFlow custom connector is implemented as an Amazon Lambda function (see: `lambdas/connector` directory). AWS CDK is used to instrument the build and deployment of the connector. 

### Steps to build and deploy

#### Prerequisites

- PetStore API is deployed using this tutorial: [Tutorial: Create a REST API by importing an example](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-from-example.html)
- [Docker](https://www.docker.com/) is running
- [CDK](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) is installed

1. Build
```
cd provider
npm install
```
2. Deploy
```
cdk deploy petstore-connector
```

## PetStore Consumer L1

The code in the `consumer-l1` directory is a sample implementation for creating an Amazon AppFlow Connector Profile, that is a consumer-required instance of an Amazon AppFlow Connector that the provider code deploys. 

This component requires `provider` to successfully deploy a connector and needs to be run against the same AWS Accound and AWS Region as Amazon AppFlow is an AWS Accound an AWS Region bound service.

### Steps to build and deploy

1. Build
```
cd consumer-l1
npm install
```
2. Deploy
```
cdk deploy petstore-connector-consumer-l1-stack
```

## PetStore Consumer L2

The code in the `consumer-l2` directory is a sample implementation for an end-to-end solution including an Amazon AppFlow Connector Profile, and presenting how to build an Amazon AppFlow flow from the PetStore API to S3.

This component requires `provider` to successfully deploy a connector and needs to be run against the same AWS Accound and AWS Region as Amazon AppFlow is an AWS Accound an AWS Region bound service.

### Steps to build and deploy

1. Build
```
cd consumer-l1
npm install
```
2. Deploy
```
cdk deploy petstore-connector-consumer-l2-stack