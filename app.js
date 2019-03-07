const express = require('express');
const AWS = require('aws-sdk');
const _ = require('lodash');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.send("connected....!!!");
})

app.post('/', function(req, res) {
    console.log("headers", JSON.stringify(req.headers))
    let awsConfig = {
        accessKeyId: req.headers.aws_accesskey,
        secretAccessKey: req.headers.aws_secretaccesskey
    };
    if (_.isUndefined(req.headers.aws_region) === false)
        awsConfig["region"] = req.headers.aws_region;

    AWS.config.update(awsConfig);
    let key = req.headers.aws_key || "file.json";
    //console.log("key:",key)
    let objectParams = { Bucket: req.headers.aws_bucketname, Key: key, Body: JSON.stringify(req.body) };
    let uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
    uploadPromise.then(
            function(data) {
                res.send(data)
            })
        .catch(
            function(err) {
                res.statusCode = err.statusCode;
                res.send(err)
            });
    //res.send("test")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))