`use strict`;

const fs = require(`fs`);
const multer = require(`multer`);
const async_npm = require(`async`);
const Path = require(`path`);
const AWS = require(`aws-sdk`);
const mime = require(`mime-types`);
const gm = require(`gm`).subClass({imageMagick: true});
const fsExtra = require(`fs-extra`);

const {AWS_CONFIG} = require(`../config`);
const {IMAGE_PREFIX, SERVER} = require(`../utils/constants`);

AWS.config.update({
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
});

let S3 = new AWS.S3();
let fileUploadService = {};

/**
 * Storage for file in local machine
 * @type {DiskStorage|DiskStorage}
 */
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './client/uploads/')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname.split('.');
        let fileExtension = fileName[fileName.length - 1];
        cb(null, Date.now() + '.' + fileExtension);
    }
});

/**
 * Upload single file
 * @type {*|*}
 */
const upload = multer({storage: storage}).single('file');

/**
 * Upload file
 * @param {*} file
 */
fileUploadService.uploadFile = async (request, response) => {
    return new Promise(async (resolve, reject) => {
        /** Upload pic locally first **/
        upload(request, response, async (err) => {
            if (err) {
                return reject(`Error: ${err}`);
            }
            /** File data **/
            let fileData = request.file, fileName = fileData.originalname.split('.'),
                fileExtension = fileName[fileName.length - 1];

            fileName = Date.now() + '.' + fileExtension;
            let path = fileData.path;
            fileData.original = IMAGE_PREFIX.FEED + fileName;
            fileData.thumb = IMAGE_PREFIX.THUMB + fileName;
            let finalArray = await setFileFinalArray(fileData);

            try {
                await fileUploadService.createThumbImage(path, finalArray[SERVER.NOT].path);
                let functionsArray = await [
                    await fileUploadService.uploadFileS3(finalArray[SERVER.NOT], SERVER.NOT),
                    await fileUploadService.uploadFileS3(finalArray[SERVER.YES], SERVER.YES)
                ];
                fileUploadService.deleteFile(finalArray[SERVER.NOT].path);
                fileUploadService.deleteFile(finalArray[SERVER.YES].path);
                return resolve({
                    imgUrl: AWS_CONFIG.s3URLFeed + fileData.original,
                    thumb: AWS_CONFIG.s3URLThumb + fileData.thumb
                });
            } catch (e) {
                reject(e);
            }
        });
    })
};


/** Create image **/
fileUploadService.createThumbImage = async (originalPath, thumbnailPath) => {
    return new Promise((resolve, reject) => {

        var readStream = fs.createReadStream(originalPath);
        gm(readStream)
            .size({bufferStream: true}, function (err, size) {
                console.log(`GM Error: ${JSON.stringify(err)}`);
                if (size) {
                    let height = 150;
                    let width = (size.width * height) / size.height;
                    this.thumb(width, height, thumbnailPath, 30,
                        /* .autoOrient()
                        .write(thumbnailPath1,*/ function (err, data) {
                            console.log(`GM Error: ${JSON.stringify(err)}`);
                            err ? reject(err) : resolve(data);
                        })
                }
            });
    });
};


/** Remove file  **/
fileUploadService.deleteFile = (path) => {
    return fsExtra.remove(path);
};


/** Upload image to s3 bucket **/
fileUploadService.uploadFileS3 = async (fileObj, index) => {
    return new Promise((resolve, reject) => {
        const fileName = Path.basename(fileObj.finalUrl);
        const stats = fs.statSync(fileObj.path);
        const fileSizeInBytes = stats["size"];

        fs.readFile(fileObj.path, (err, fileData) => {
            S3.putObject({
                Bucket: AWS_CONFIG.bucket + AWS_CONFIG.feedfolder[index],
                Key: fileName,
                Body: fileData,
                ContentType: mime.lookup(fileName)
            }, (err, data) => {

                err ? reject(err) : resolve(data);
            });
        });
    })
};


/**
 * manage thumb and original url with file
 * @param fileData
 * @returns {Promise<{path: string, finalUrl: string}[]>}
 */
const setFileFinalArray = async (fileData) => {
    let imageUrls = [{
        path: Path.resolve('.') + '/client/uploads/' + fileData.thumb,
        finalUrl: AWS_CONFIG.s3URLThumb + fileData.thumb,
    }];

    /** Profile image **/
    imageUrls.push({
        path: fileData.path,
        finalUrl: AWS_CONFIG.s3URLFeed + fileData.original
    });

    return imageUrls;
};


/**export file upload service**/
module.exports = fileUploadService;

