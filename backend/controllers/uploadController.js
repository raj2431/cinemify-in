const crypto = require('crypto');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getS3Client } = require('../config/s3');

const ALLOWED_KINDS = ['poster', 'banner', 'trailer', 'video'];
const CONTENT_TYPE_PREFIXES = {
  poster: 'image/',
  banner: 'image/',
  trailer: 'video/',
  video: 'video/',
};

const buildPublicUrl = (key) => {
  if (process.env.AWS_CLOUDFRONT_DOMAIN) {
    return `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`;
  }
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const presignUpload = async (req, res) => {
  try {
    if (!process.env.AWS_S3_BUCKET || !process.env.AWS_REGION) {
      return res.status(503).json({ message: 'File uploads are not configured. Set AWS_S3_BUCKET, AWS_REGION and AWS credentials in the backend .env.' });
    }

    const { fileName, fileType, kind } = req.body;

    if (!ALLOWED_KINDS.includes(kind)) {
      return res.status(400).json({ message: `kind must be one of: ${ALLOWED_KINDS.join(', ')}` });
    }
    if (!fileType || !fileType.startsWith(CONTENT_TYPE_PREFIXES[kind])) {
      return res.status(400).json({ message: `fileType must be a ${CONTENT_TYPE_PREFIXES[kind]}* mime type for kind=${kind}` });
    }

    const ext = path.extname(fileName || '').slice(0, 10);
    const safeExt = /^\.[a-zA-Z0-9]+$/.test(ext) ? ext : '';
    const key = `${kind}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 15 * 60 });

    return res.json({ uploadUrl, publicUrl: buildPublicUrl(key), key });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create upload URL', error: err.message });
  }
};

module.exports = { presignUpload };
