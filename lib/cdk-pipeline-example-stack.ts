import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
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

    // example resource
    // const queue = new sqs.Queue(this, 'CdkPipelineExampleQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
