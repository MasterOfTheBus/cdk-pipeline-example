import { Construct } from "@aws-cdk/core";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { Action, CodeBuildAction } from "@aws-cdk/aws-codepipeline-actions";
import { Artifacts, Project, Source } from "@aws-cdk/aws-codebuild";
import { Bucket } from "@aws-cdk/aws-s3";
import { GithubSourceDef } from "./sourcedef";

export interface CodeBuildConstructProps {
    primarySourceArtifact: Artifact;
    sourceInfo: GithubSourceDef;
    deployBucket: Bucket;
}

export class CodeBuildConstruct extends Construct {
    public readonly buildAction: Action;
    public readonly outputArtifact: Artifact;

    constructor(scope: Construct, id: string, props: CodeBuildConstructProps) {
        super(scope, id);

        // Define the CodeBuild Project
        const project = new Project(this, 'SourceBuildProject', {
            projectName: 'SourceBuildProject',
            source: Source.gitHub({
                owner: props.sourceInfo.repoOwner,
                repo: props.sourceInfo.repo
            }),
            artifacts: Artifacts.s3({
                // Use name from the buildspec
                bucket: props.deployBucket
            })
        })

        this.outputArtifact = new Artifact();
        this.buildAction = new CodeBuildAction({
            actionName: `SourceBuild`,
            project: project,
            input: props.primarySourceArtifact,
            outputs: [this.outputArtifact]
        });

        // TODO: Implement secondary artifacts and sources if needed
    };
};