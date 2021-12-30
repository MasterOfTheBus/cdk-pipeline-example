import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipelineConstruct, CodeStarConnectionDef } from '@masterofthebus/cdk-pipeline-lib';
import { MyPipelineAppStage } from './my-pipeline-app-stage';

export class CdkPipelineExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipelineSource = new CodeStarConnectionDef({
      // A CodeStar Connection ARN
      codeStarConnection: "arn:aws:codestar-connections:us-east-1:025257542471:connection/b53232ef-36cd-40e2-90ce-4bed059aed57",
      repo: "cdk-pipeline-example",
      repoOwner: "MasterOfTheBus",
      branch: "main"
    });

    const codeSource = new CodeStarConnectionDef({
      // A CodeStar Connection ARN
      codeStarConnection: "arn:aws:codestar-connections:us-east-1:025257542471:connection/b53232ef-36cd-40e2-90ce-4bed059aed57",
      repo: "test_lambda_deploy",
      repoOwner: "MasterOfTheBus",
      branch: "main"
    });

    const bucketArn = 'arn:aws:s3:::sng-lambda-deployments-bucket';

    const pipeline = new CodePipelineConstruct(this, 'CodePipeline', {
      pipelineSource: pipelineSource,
      source: codeSource,
      artifactBucketArn: bucketArn
    });

    pipeline.pipeline.addStage(
      new MyPipelineAppStage(this ,'TestLambda', bucketArn, `${codeSource.repo}/artifacts.zip`, {
        env: { account: '025257542471', region: 'us-east-1' }
      })
    )
  }
}
