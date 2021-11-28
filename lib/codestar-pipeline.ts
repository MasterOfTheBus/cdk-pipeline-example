import { Construct } from '@aws-cdk/core';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { CodeStarConnectionsSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import { CodeBuildConstruct } from './sourcebuild-action';
import { CodeStarConnectionDef } from "./sourcedef";
import { Bucket } from "@aws-cdk/aws-s3";

export interface CodeStarConnectionPipelineProps {
    primarySourceInfo: CodeStarConnectionDef;
    deployBucket: Bucket;
    pipelineName?: string;
    crossAccount?: boolean;
    // TODO: Allow for multiple sources and artifacts
}

export class CodeStarConnectionPipeline extends Construct {
    public readonly pipeline: Pipeline;
    public readonly outputArtifact: Artifact;

    constructor(scope: Construct, id: string, props: CodeStarConnectionPipelineProps) {
        super(scope, id);

        // Define the pipeline
        this.pipeline = new Pipeline(this, 'Pipeline', {
            pipelineName: props.pipelineName || 'MyPipeline',
            crossAccountKeys: props.crossAccount || false
        });

        // Define the primary source action
        const sourceOutput = new Artifact(`source`);
        const sourceAction = new CodeStarConnectionsSourceAction({
            actionName: `Source`,
            owner: props.primarySourceInfo.repoOwner,
            repo: props.primarySourceInfo.repo,
            output: sourceOutput,
            connectionArn: props.primarySourceInfo.codeStarConnection
        });
        this.pipeline.addStage({
            stageName: 'Source',
            actions: [sourceAction]
        });

        // Define the build action
        const actionDefs = new CodeBuildConstruct(this, 'BuildDefs', {
            primarySourceArtifact: sourceOutput,
            deployBucket: props.deployBucket
        });
        this.pipeline.addStage({
            stageName: 'Build',
            actions: [actionDefs.buildAction]
        });
        this.outputArtifact = actionDefs.outputArtifact;
    }
}