#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SolitaireStack } from '../lib/solitaire-stack';

const app = new cdk.App();

// Single stack for production deployment
new SolitaireStack(app, 'SolitaireStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'us-east-1', // Required for CloudFront certificates
    },
});
