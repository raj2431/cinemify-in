const { S3Client } = require('@aws-sdk/client-s3');

let cachedClient = null;

const getS3Client = () => {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: process.env.AWS_REGION,
      credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } : undefined,
    });
  }
  return cachedClient;
};

module.exports = { getS3Client };
