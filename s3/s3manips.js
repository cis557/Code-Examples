const AWS = require('aws-sdk');
const fs = require('fs');
// The access ID and secret key of the S3 bucket
const ID = '<contact_your_ta_to_get_the_key>';
const SECRET = 'contact_your_ta_to_get_the_secret_key';

// The name of the bucket that you have created
const BUCKET_NAME = 'cis557sp21';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


// upload a file
const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg', // File name we want to upload
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile('cat.jpg');

// read a file
const readFile = (fileName) => {
    // Setting up S3 read parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg', // File name we want to retrieve
    };

    // download file from the bucket
    s3.getObject(params, function(err, data) {
        if (err) {
            throw err;
        }
        // do something with the file
        const fStream = fs.createWriteStream('cat1.jpg');
        fStream.write(data.Body);
        fStream.end();

        console.log(`File downloaded successfully. ${data.Body}`);
    });
};

readFile('cat.jpg');


// delete a file
const deleteFile = (fileName) => {
    // Setting up S3 delete parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg', // File name we want to delete
    };

    // download file from the bucket
    s3.deleteObject(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File deleted successfully. ${data}`);
    });
};

deleteFile('cat.jpg');

