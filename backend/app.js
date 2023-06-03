var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var url = "mongodb://localhost:27017/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(4000, function () { console.log('listening on 4000'); });
app.use(express.static(__dirname));

MongoClient.connect(url, function (err, db) {
    if (err) {
        throw err;
    } else { console.log('DB Connected!!') }
    var dbo = db.db("myapp");
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post("/GetData", function (req, res) {
        dbo.collection('ScheduleData').find({}).toArray(function (err, cus) {
            for (var i = 0; i < cus.length; i++) {
                var sdate = new Date(cus[i].StartTime);
                var edate = new Date(cus[i].EndTime);
                cus[i].StartTime = (new Date(+sdate)); 
                //cus[i].StartTime = (new Date(+sdate - (sdate.getTimezoneOffset() * 60000))); 
                cus[i].EndTime = (new Date(+edate)); 
                //cus[i].EndTime = (new Date(+edate - (edate.getTimezoneOffset() * 60000)));
            }
            res.send(cus);
        });
    });

    app.post("/BatchData", function (req, res) {
        var eventData = [];
        if (req.body.action === "insert" || (req.body.action === "batch" && req.body.added.length > 0)) {
            (req.body.action === "insert") ? eventData.push(req.body.value) : eventData = req.body.added;
            for (var a = 0; a < eventData.length; a++) {
                eventData[a].StartTime = new Date(eventData[a].StartTime);
                eventData[a].EndTime = new Date(eventData[a].EndTime);
                dbo.collection('ScheduleData').insertOne(eventData[a]);
            }
        }
        if (req.body.action === "update" || (req.body.action === "batch" && req.body.changed.length > 0)) {
            (req.body.action === "update") ? eventData.push(req.body.value) : eventData = req.body.changed;
            for (var b = 0; b < eventData.length; b++) {
                delete eventData[b]._id;
                eventData[b].StartTime = new Date(eventData[b].StartTime);
                eventData[b].EndTime = new Date(eventData[b].EndTime);
                dbo.collection('ScheduleData').updateOne({ "Id": eventData[b].Id }, { $set: eventData[b] });
            }
        }
        if (req.body.action === "remove" || (req.body.action === "batch" && req.body.deleted.length > 0)) {
            (req.body.action === "remove") ? eventData.push({ Id: req.body.key }) : eventData = req.body.deleted;
            for (var c = 0; c < eventData.length; c++) {
                dbo.collection('ScheduleData').deleteOne({ "Id": eventData[c].Id });
            }
        }
        res.send(req.body);
    });

}
);
