const qiniu = require("qiniu");

const qiniuHttp = "http://cdn.liyi.online";

// 七牛云认证
const accessKey = "hdUy8w7obc3Y8txW0zj4SCN5AazLNq6idz9rYVKR";
const secretKey = "ZTRsC8HloMDAo-ngwl0kCbi-sNujHQc5c94br-7P";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 七牛云文件上传的空间
const qiniuBucket = "luoyi-test";

function getUploadToken(fileName) {
  // 创建上传token
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: qiniuBucket + ":" + fileName // 空间名
  });
  const uploadToken = putPolicy.uploadToken(mac);
  return uploadToken;
}

// 创建七牛云配置
const qiniuConfig = new qiniu.conf.Config();
qiniuConfig.zone = qiniu.zone.Zone_z2; // 机房所在地

// 创建七牛云空间管理
const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);

module.exports = {
  qiniuHttp,
  qiniuBucket,
  qiniuConfig,
  bucketManager,
  getUploadToken
};
