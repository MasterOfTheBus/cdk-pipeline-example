import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CodeStarConnectionDef, MultiSourcePipeline } from '@masterofthebus/cdk-pipeline-lib/lib';

export class CdkPipelineExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const source = new CodeStarConnectionDef({
      // A CodeStar Connection ARN
      codeStarConnection: "arn:aws:codestar-connections:us-east-1:000000000000:connection/11111111-2222-3333-4444-555555555555",
      repo: "cdk-pipeline-example",
      repoOwner: "MasterOfTheBus",
      branch: "main"
    });

    // Define the bucket to store the artifacts
    const bucket = new Bucket(this, 'PipelineBucket');

    // The pipeline construct
    new MultiSourcePipeline(this, 'MultiSourcePipline', {
        sources: [source],
        deployBucket: bucket
    });
  }
}
