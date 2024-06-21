const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const multer = require("multer");

function encodeToHttpLink(inputString) {
    return inputString.replace(/\s/g, '');
}
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
});

exports.uploadImage = (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'profile_pictures/' + encodeToHttpLink(file.originalname),
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return new Promise((resolve, reject) => {
        s3Client.send(new PutObjectCommand(params))
            .then((data) => {
                if (data['$metadata'].httpStatusCode === 200) {
                    resolve(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile_pictures/${encodeToHttpLink(file.originalname)}`);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.uploadFile = (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'files/' + encodeToHttpLink(file.originalname),
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return new Promise((resolve, reject) => {
        s3Client.send(new PutObjectCommand(params))
            .then((data) => {
                if (data['$metadata'].httpStatusCode === 200) {
                    resolve(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/files/${encodeToHttpLink(file.originalname)}`);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        req.video_file = false;
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};
exports.upload = multer({
    storage,
    // fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024,
        files: 5,
    },
});
