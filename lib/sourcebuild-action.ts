import { Construct } from "@aws-cdk/core";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { Action, CodeBuildAction } from "@aws-cdk/aws-codepipeline-actions";
import { Artifacts, Project } from "@aws-cdk/aws-codebuild";
import { Bucket } from "@aws-cdk/aws-s3";

export interface CodeBuildConstructProps {
    primarySourceArtifact: Artifact;
    deployBucket: Bucket;
}

export class CodeBuildConstruct extends Construct {
    public readonly buildAction: Action;

    constructor(scope: Construct, id: string, props: CodeBuildConstructProps) {
        super(scope, id);

        // Define the CodeBuild Project
        const project = new Project(this, 'SourceBuildProject', {
            projectName: 'SourceBuildProject',
            artifacts: Artifacts.s3({
                // Use name from the buildspec
                bucket: props.deployBucket
            })
        })

        this.buildAction = new CodeBuildAction({
            actionName: `SourceBuild`,
            project: project,
            input: props.primarySourceArtifact
        });

        // TODO: Implement secondary artifacts and sources if needed
    };
};