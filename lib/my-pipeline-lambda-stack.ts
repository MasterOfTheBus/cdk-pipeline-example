import * as cdk from '@aws-cdk/core';
import { Function, Code, InlineCode, Runtime } from '@aws-cdk/aws-lambda';
import { Bucket } from "@aws-cdk/aws-s3";
import { Artifact } from '@aws-cdk/aws-codepipeline';

export interface MyLambdaStackProps {
  bucket?: Bucket;
  s3Artifact?: Artifact;
  stackProps?: cdk.StackProps;
}

export class MyLambdaStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: MyLambdaStackProps) {
      super(scope, id, props?.stackProps);

      if (props?.bucket && props?.s3Artifact) {
        new Function(this, 'LambdaFunction', {
          functionName: 'TestCdkLambda',
          runtime: Runtime.PYTHON_3_9,
          handler: 'sample_lambda_handler.handler',
          code: Code.fromBucket(props.bucket, props.s3Artifact.objectKey)
        })
      } else {
        new Function(this, 'LambdaFunction', {
          runtime: Runtime.NODEJS_12_X,
          handler: 'index.handler',
          code: new InlineCode('exports.handler = _ => "Hello, CDK";')
        });
      }
    }
}
