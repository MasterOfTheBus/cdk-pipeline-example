import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib/core';
import { MyLambdaStack } from '../lib/my-pipeline-lambda-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/cdk-pipeline-example-stack.ts
test('SQS Queue Created', () => {
      const app = new cdk.App();
        // WHEN
      const stack = new MyLambdaStack(app, 'MyTestStack', 'arn:aws:s3:::sng-lambda-deployments-bucket', 'artifacts.zip');
        // THEN
      const template = Template.fromStack(stack);
    
      template.resourceCountIs('AWS::Lambda::Function', 1);
      template.resourceCountIs('AWS::ApiGateway::Method', 1);
    });
    