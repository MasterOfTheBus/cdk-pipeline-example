import * as cdk from '@aws-cdk/core';
import { MyLambdaStack } from './my-pipeline-lambda-stack';
import { Bucket } from "@aws-cdk/aws-s3";
import { Artifact } from '@aws-cdk/aws-codepipeline';

export interface MyPipelineAppStageProps {
  bucket?: Bucket;
  s3Artifact?: Artifact;
  stageProps?: cdk.StageProps;
}

export class MyPipelineAppStage extends cdk.Stage {

    constructor(scope: cdk.Construct, id: string, props?: MyPipelineAppStageProps) {
      super(scope, id, props?.stageProps);

      const lambdaStack = new MyLambdaStack(this, 'LambdaStack', {
        bucket: props?.bucket
      });
    }
}
