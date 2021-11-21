import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';
// import { ManualApprovalStep } from '@aws-cdk/pipelines';
// import * as sqs from '@aws-cdk/aws-sqs';

export class CdkPipelineExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CdkPipelineExample',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('MasterOfTheBus/cdk-pipeline-example', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: { account: "025257542471", region: "us-east-1"}
    }));

    /** Defines a testing stage with manual approval as a post-deployment step */
    // const testingStage = pipeline.addStage(new MyPipelineAppStage(this, 'testing', {
    //   env: { account: '025257542471', region: 'us-east-1' }
    // }));
    //
    // testingStage.addPost(new ManualApprovalStep('approval'));

    /** Defines a wave of parallel deployment stages */
    // const wave = pipeline.addWave('wave');
    // wave.addStage(new MyApplicationStage(this, 'MyAppEU', {
    //   env: { account: '025257542471', region: 'us-east-1' }
    // }));
    // wave.addStage(new MyApplicationStage(this, 'MyAppUS', {
    //   env: { account: '025257542471', region: 'us-west-1' }
    // }));


    // example resource
    // const queue = new sqs.Queue(this, 'CdkPipelineExampleQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
