export interface AWSFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export interface AWSBucketConfig {
  bucketName: string;
  cloudFrontDistributionId: string;
}
