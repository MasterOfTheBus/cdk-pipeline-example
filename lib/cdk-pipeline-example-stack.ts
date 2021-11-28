import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';

export class CdkPipelineExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the underlying CodePipeline stack
    let pipelineName = process.env.PIPELINE_NAME || 'Pipeline';
    let repoOwner = process.env.REPO_OWNER || ''; // TODO: Default value?
    let repo = process.env.REPO || '';
    let codeStarConnection = process.env.CONNECTION || '';
    
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      owner: repoOwner,
      repo: repo,
      output: sourceOutput,
      connectionArn: codeStarConnection,
    });

    const underlyingPipe = new codepipeline.Pipeline(this, pipelineName, {
      crossAccountKeys: false
    });
    const stage = underlyingPipe.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    })

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
  }
}
