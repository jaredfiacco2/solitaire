import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class SolitaireStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const domainName = 'solitaire.jfiacco.com';
        const hostedZoneId = 'Z07910653PB1T13XGLOAW'; // jfiacco.com hosted zone

        // 1. S3 Bucket for static hosting (private, accessed via CloudFront OAC)
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // 2. Look up existing hosted zone
        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: hostedZoneId,
            zoneName: 'jfiacco.com',
        });

        // 3. ACM Certificate for HTTPS
        const certificate = new acm.Certificate(this, 'Certificate', {
            domainName: domainName,
            validation: acm.CertificateValidation.fromDns(hostedZone),
        });

        // 4. CloudFront Distribution
        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
            },
            domainNames: [domainName],
            certificate,
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html', // SPA fallback for React Router
                    ttl: cdk.Duration.minutes(5),
                },
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html', // SPA fallback
                    ttl: cdk.Duration.minutes(5),
                },
            ],
        });

        // 5. Route53 A Record (Alias to CloudFront)
        new route53.ARecord(this, 'AliasRecord', {
            zone: hostedZone,
            recordName: 'solitaire', // Creates solitaire.jfiacco.com
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        });

        // Outputs for GitHub Actions
        new cdk.CfnOutput(this, 'S3BucketName', {
            value: siteBucket.bucketName,
            description: 'S3 bucket name for GitHub Actions S3_BUCKET variable',
            exportName: 'SolitaireS3Bucket',
        });

        new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
            value: distribution.distributionId,
            description: 'CloudFront distribution ID for GitHub Actions CLOUDFRONT_ID variable',
            exportName: 'SolitaireCloudFrontId',
        });

        new cdk.CfnOutput(this, 'SiteURL', {
            value: `https://${domainName}`,
            description: 'Solitaire website URL',
        });
    }
}
