import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { Function, Runtime, S3Code } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class MyLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, bucketArn: string, key: string, props?: cdk.StackProps) {
      super(scope, id, props);

      const bucket = Bucket.fromBucketArn(this, 'ArtifactBucket', bucketArn);

      new Function(this, 'LambdaFunction', {
        runtime: Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: new S3Code(bucket, key)
      });
    }
}
