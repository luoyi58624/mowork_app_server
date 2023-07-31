const express = require("express");
const model = require("./model");
const multer = require("multer");
const qiniu = require("qiniu");
const stream = require("stream");

const { check, validationResult } = require("express-validator");
const { isEmpty } = require("../../utils/common");
const { qiniuHttp, qiniuConfig, getUploadToken, bucketManager, qiniuBucket } = require("../../utils/qiniu");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter: (req, file, callback) => {
    if (file.originalname.endsWith(".apk")) {
      console.log(req.body);
      file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
      callback(null, true);
    } else {
      callback(new Error("上传的文件类型必须为apk"));
    }
  }
});

router.get("/", async (req, res, next) => {
  res.send({
    code: 200,
    data: await model.find().sort({ versionCode: -1 }).exec()
  });
});

router.post(
  "/",
  upload.single("file"),
  [
    check("appName", "请传入App名字").notEmpty(),
    check("versionName", "请传入版本名字").notEmpty(),
    check("versionCode", "请传入版本号").notEmpty()
  ],
  async (req, res, next) => {
    console.log(req.file);
    if (isEmpty(req.file)) {
      return res.send({
        code: 500,
        msg: "请传入文件"
      });
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({
        code: 500,
        msg: result.array()
      });
    }

    const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    const uploadToken = getUploadToken(req.body["appName"]);
    // 以二进制流的形式上传
    formUploader.putStream(
      uploadToken,
      req.body["appName"],
      stream.Readable.from(req.file.buffer),
      putExtra,
      async function(respErr, respBody, respInfo) {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          await model({
            ...req.body,
            fileSize: req.file.size,
            downloadUrl: `${qiniuHttp}/${req.body.appName}`
          }).save();
          res.send({
            code: 200,
            data: "上传成功"
          });
        } else {
          console.log(respInfo);
          res.send({
            code: 500,
            data: "七牛云上传失败"
          });
        }
      }
    );
  }
);

router.put(
  "/",
  upload.single("file"),
  [
    check("_id", "请传入_id").notEmpty(),
    check("appName", "请传入App名字").notEmpty(),
    check("versionName", "请传入版本名字").notEmpty(),
    check("versionCode", "请传入版本号").notEmpty()
  ],
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({
        code: 500,
        msg: result.array()
      });
    }

    await model.findByIdAndUpdate(req.body["_id"], {
      ...req.body,
      fileSize: req.file?.size ?? undefined,
      downloadUrl: req.body.appName ? `/apk/${req.body.appName}` : undefined
    });
    res.send({
      code: 200,
      data: "更新成功"
    });
  }
);

router.delete("/:id", async (req, res, next) => {
  const ids = req.params.id.split(",");
  const datas = await model.find({ _id: { $in: ids } });
  const names = datas.map(item => item.appName);
  names.forEach(name => {
    bucketManager.delete(qiniuBucket, name, (err, respBody, respInfo) => {
        if (err) {
          console.log(err);
        } else {
          console.log(respInfo, "七牛云文件删除成功");
        }
      }
    );
  });
  await model.deleteMany({ _id: { $in: ids } });
  res.send({
    code: 200,
    data: "删除成功"
  });
});

router.get("/newVersion", async (req, res, next) => {
  res.send({
    code: 200,
    data: await model.findOne().sort({ versionCode: -1 }).exec()
  });
});

module.exports = router;
