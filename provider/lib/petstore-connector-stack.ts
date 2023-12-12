import type { Construct } from 'constructs'
import * as path from 'path'
import { Aws, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources'
import { Runtime as LambdaRuntime } from 'aws-cdk-lib/aws-lambda'
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha'

export interface PetStoreConnectorStackProps extends StackProps {
  readonly petStoreConnectorName: string
  readonly petStoreConnectorDescription: string
}

export class PetStoreConnectorStack extends Stack {
  constructor(scope: Construct, id: string, props: PetStoreConnectorStackProps) {
    super(scope, id, props)

    const petstoreConnectorFunction = new PythonFunction(this, 'petstore-connector-lambda', {
      runtime: LambdaRuntime.PYTHON_3_11,
      entry: path.join(__dirname, '../lambdas/connector'),
      index: 'petstore.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(30)
    })

    petstoreConnectorFunction.addPermission('appflow', {
      principal: new ServicePrincipal('appflow.amazonaws.com'),
      sourceAccount: Aws.ACCOUNT_ID,
      sourceArn: `arn:aws:appflow:${Aws.REGION}:${Aws.ACCOUNT_ID}:*`,
      action: 'lambda:InvokeFunction'
    })

    const registrar = new AwsCustomResource(this, 'Registrar', {
      onCreate: {
        service: 'Appflow',
        action: 'registerConnector',
        parameters: {
          connectorLabel: props.petStoreConnectorName,
          description: props.petStoreConnectorDescription,
          connectorProvisioningType: 'LAMBDA',
          connectorProvisioningConfig: {
            lambda: {
              lambdaArn: petstoreConnectorFunction.functionArn
            }
          }
        },
        physicalResourceId: PhysicalResourceId.of('Registrar')
      },
      onDelete: {
        service: 'Appflow',
        action: 'unregisterConnector',
        parameters: {
          connectorLabel: props.petStoreConnectorName,
          forceDelete: true
        }
      },
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: [
            'appflow:RegisterConnector'
          ],
          resources: [`arn:aws:appflow:${Aws.REGION}:${Aws.ACCOUNT_ID}:connector/*`],
          effect: Effect.ALLOW
        }),
        new PolicyStatement({
          actions: [
            'appflow:UnRegisterConnector'
          ],
          resources: [
            `arn:aws:appflow:${Aws.REGION}:${Aws.ACCOUNT_ID}:/unregister-connector`
          ],
          effect: Effect.ALLOW
        }),
        new PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          resources: [petstoreConnectorFunction.functionArn],
          effect: Effect.ALLOW
        })
      ]),
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
