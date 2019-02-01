import { CloudFront, S3, AWSError } from 'aws-sdk';
import { CreateInvalidationResult, CreateInvalidationRequest } from 'aws-sdk/clients/cloudfront';
import { PutObjectOutput, PutObjectRequest } from 'aws-sdk/clients/s3';
import { AWSFile } from '../interfaces';

const MONTH_IN_MILLISECONDS = 2592000000;
const EXPIRE_TIME = new Date(Date.now() + MONTH_IN_MILLISECONDS * 30);

export class AWSClient {

  cloudFront: CloudFront;
  s3: S3;

  constructor(
    public bucketName: string,
    public cloudFrontDistributionId: string,
    config: CloudFront.ClientConfiguration,
  ) {
    this.cloudFront = new CloudFront(config);
    this.s3 = new S3(config);
  }

  /**
   * Uploads the Files to the s3 Bucket.
   * After every File was uploaded the invalidate function is called to invalidate the cache
   */
  upload(files: AWSFile[]): Promise<AWSError | CreateInvalidationResult> {
    const promises = files.map((file: AWSFile) => {
      const params: PutObjectRequest = {
        ACL: 'public-read',
        Body: file.buffer,
        Bucket: this.bucketName,
        ContentType: file.mimeType,
        ContentLength: file.buffer.byteLength,
        Expires: EXPIRE_TIME,
        Key: `${file.name}`,
      };

      return new Promise((res: (data: AWSFile) => void, rej: (data: AWSError) => void) => {
        this.s3.putObject(params, (err: AWSError, data: PutObjectOutput) => {
          if (err) {
            console.error(err);
            rej(err);
          }
          console.log(`uploaded -> ${file.name}`);
          res(file);
        });
      });
    });

    return Promise.all(promises)
      .then(() => this.invalidate(files));
  }

  /**
   * This function uses the AWS CloudFront SDK to invalidate an array of files
   * for the caching. Returns promise when all files are invalidated.
   * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
  */
  private invalidate(files: AWSFile[]): Promise<CreateInvalidationResult | AWSError> {
    const params: CreateInvalidationRequest = {
      DistributionId: this.cloudFrontDistributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: files.length,
          Items: files.map(file => `/${file.name}`),
        },
      },
    };
    // AWS needs base to invalidate as well
    params.InvalidationBatch.Paths.Items.push('/');
    params.InvalidationBatch.Paths.Quantity += 1;

    return new Promise((
      res: (data: CreateInvalidationResult) => void,
      rej: (err: AWSError) => void,
    ) => {
      this.cloudFront.createInvalidation(params, (err: AWSError, data) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        console.log(`invalidated all ${files.length} files!`);
        res(data);
      });
    });
  }
}
