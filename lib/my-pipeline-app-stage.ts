import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { MyLambdaStack } from './my-pipeline-lambda-stack';

export class MyPipelineAppStage extends cdk.Stage {

    constructor(scope: Construct, id: string, bucketArn: string, key: string, props?: cdk.StageProps) {
      super(scope, id, props);

      const lambdaStack = new MyLambdaStack(this, 'LambdaStack', bucketArn, key);
    }
}
