import { readDirRecursively } from '@sketchmine/node-helpers';
import { AWSClient, fileTransformer } from './aws';
import { resolve } from 'path';
import { AWSBucketConfig } from './interfaces';

async function main(args: string[]): Promise<void> {
  const {
    id,
    secret,
    dir = process.cwd(),
    config = resolve('config.json'),
  } = require('minimist')(args);

  if (!id || !secret) {
    console.error('Credentials for AWS S3 have to be set with --id <ID> --secret <SECRET>!');
    process.exit(1);
  }

  const { bucketName, cloudFrontDistributionId } = require(config) as AWSBucketConfig;
  const awsConfig = {
    credentials: {
      accessKeyId: id,
      secretAccessKey: secret,
    },
  };

  const client = new AWSClient(bucketName, cloudFrontDistributionId, awsConfig);
  const filesArray = await readDirRecursively(resolve(dir), /.+?\..+$/);
  const files = filesArray
    .map((file: string) => fileTransformer(file))
    .filter(f => f !== undefined);

  await client.upload(files);
}

main(process.argv.slice(2))
.then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
