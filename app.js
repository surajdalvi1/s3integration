const express = require('express');
const AWS = require('aws-sdk');
const _ = require('lodash');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.send("connected server....!!!");

})
app.get('/listObject', function(req, res) {
    let awsConfig = {
        accessKeyId: req.headers.aws_accesskey,
        secretAccessKey: req.headers.aws_secretaccesskey
    };
    AWS.config.update(awsConfig);
    var params = {
        Bucket: req.headers.aws_bucketname
    }
    new AWS.S3({ apiVersion: '2006-03-01' }).listObjects(params, function(err, data) {
        if (err) throw err;
        //console.log(JSON.stringify(data))
        res.send(data)
    });
})
app.get('/delete', function(req, res) {
    res.send("connected server delete....!!!");

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
    let key = req.headers.aws_filename || "file.json";
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

app.post('/delete', function(req, res) {
    console.log("headers", JSON.stringify(req.headers))
    let awsConfig = {
        accessKeyId: req.headers.aws_accesskey,
        secretAccessKey: req.headers.aws_secretaccesskey
    };
    if (_.isUndefined(req.headers.aws_region) === false)
        awsConfig["region"] = req.headers.aws_region;

    AWS.config.update(awsConfig);
    let key = req.headers.aws_filename || "file.json";
    //console.log("key:",key)
    let objectParams = { Bucket: req.headers.aws_bucketname, Key: key };
    let uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).deleteObject(objectParams).promise();
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