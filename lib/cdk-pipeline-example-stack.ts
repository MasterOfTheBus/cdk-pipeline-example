import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';
import { CodeStarConnectionPipeline } from './codestar-pipeline';
import { Bucket } from "@aws-cdk/aws-s3";
import { CodeStarConnectionDef } from './sourcedef';

export class CdkPipelineExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the underlying CodePipeline
    const bucket = new Bucket(this, 'PipelineBucket');
    const sourceInfo = new CodeStarConnectionDef({
      codeStarConnection: "arn:aws:codestar-connections:us-east-1:025257542471:connection/b53232ef-36cd-40e2-90ce-4bed059aed57",
      repoOwner: "MasterOfTheBus",
      repo: "test_lambda_deploy"
    });
    const codestarPipeline = new CodeStarConnectionPipeline(this, 'CodeStarPipeline', {
      deployBucket: bucket,
      primarySourceInfo: sourceInfo
    })

    // The code that defines your stack goes here
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CdkPipelineExample',
      codePipeline: codestarPipeline.pipeline,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('MasterOfTheBus/cdk-pipeline-example', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: { account: "025257542471", region: "us-east-1"}
    }));
  }
}
