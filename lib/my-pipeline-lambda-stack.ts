import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib/core';
import { Function, Runtime, S3Code } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class MyLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, bucketArn: string, key: string, props?: cdk.StackProps) {
      super(scope, id, props);

      // The bucket that has the artifact
      const bucket = Bucket.fromBucketArn(this, 'ArtifactBucket', bucketArn);

      // The function to serve the API
      const handler = new Function(this, 'LambdaFunction', {
        runtime: Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: new S3Code(bucket, key)
      });

      const api = new LambdaRestApi(this, 'example-api', {
        handler: handler,
        proxy: false
      });

      const helloResource = api.root.addResource('hello');
      helloResource.addMethod('GET');

      // const api = new RestApi(this, 'hello-api', {
      //   restApiName: 'Hello Service',
      //   description: 'This service is a hello world example'
      // });

      // const appIntegration = new LambdaIntegration(handler, {
      //   requestTemplates: { 'application/json': '{ "statusCode": "200" }' }
      // });

      // api.root.addMethod('GET', appIntegration);
    }
}
