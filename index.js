// Load the SDK and UUID
var AWS = require("aws-sdk");
var uuid = require("uuid");

const express = require("express");
let app = express();

app.use("/s3/:data", (req, res) => {
  let data = req.params.data;
  writeToS3(data);
  res.json(data);
});

app.listen(3000, () => console.log("Listening on port 3000"));

var credentials = new AWS.SharedIniFileCredentials({ profile: "idexx" });
AWS.config.credentials = credentials;

// Create unique bucket name
var bucketName = "paul-tests";
// Create name for uploaded object key
var keyName = "apitest.txt";

function writeToS3(stringData) {
  var bucketPromise = new AWS.S3({ apiVersion: "2006-03-01" })
    .createBucket({ Bucket: bucketName })
    .promise();

  // Handle promise fulfilled/rejected states
  bucketPromise
    .then(function(data) {
      // Create params for putObject call
      var objectParams = {
        Bucket: bucketName,
        Key: keyName,
        Body: stringData
      };
      // Create object upload promise
      var uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
        .putObject(objectParams)
        .promise();
      uploadPromise.then(function(data) {
        console.log(
          "Successfully uploaded data to " + bucketName + "/" + keyName
        );
      });
    })
    .catch(function(err) {
      console.error(err, err.stack);
    });
}
// Create a promise on S3 service object
