const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const config = {
  oauth: {
    url: process.env.OAUTH_URL,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    userToken: process.env.OAUTH_USER_TOKEN,
  },
  publicApi: {
    url: process.env.PUBLIC_API_URL,
  },
  s3: {
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    base64Key: process.env.S3_BASE64_KEY,
    region: process.env.S3_REGION,
  },
};

module.exports = config;
