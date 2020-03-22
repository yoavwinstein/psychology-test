'use strict';
const express = require('express');
const { convertArrayToCSV } = require('convert-array-to-csv');
const bodyParser = require('body-parser');
const expressip = require('express-ip');
const fs = require('fs');


let app = express();
let router = express.Router()
let port = process.env.PORT || 3232;

let participantsDict = {};

const TEST_RESULTS_DIR = 'test_results';

app.use(expressip().getIpInfoMiddleware);
router.use('/', express.static('.'));
router.use('/audio', express.static('/audio'));

function replaceAll(str, toFind, toReplace) {
    return str.split(toFind).join(toReplace)
}

function makeDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function buildPathFromIndex(idx) {
    return TEST_RESULTS_DIR + '/' + 'participant' + idx + '.csv';
}

function getCurrentlyAvailableIndex() {
    for (var i = 0; fs.existsSync(buildPathFromIndex(i)); i++) { }
    return i;
}

makeDirIfNotExists('test_results');

app.post('/post', bodyParser.json(), function (req, res) {

    console.log(req.body);
    let header = ['זמן תגובה', 'תשובה נכונה / טעות', 'האות שהושמעה', 'תנאי', 'אימון / מבחן', 'התשובה הנכונה', 'התשובה בפועל', 'אחוז תשובות נכונות'];
    let csv = convertArrayToCSV(req.body, {
        header
    });
    console.log(csv);

    let csvBom = '\ufeff' + csv;
    let idx;
    if (req.ipInfo.ip in participantsDict) {
        idx = participantsDict[req.ipInfo.ip];
    } else {
        idx = getCurrentlyAvailableIndex();
        participantsDict[req.ipInfo.ip] = idx;
    }
    let fileName = buildPathFromIndex(idx);
    fs.writeFileSync(fileName, csvBom);

    res.send('');
});

module.exports = router;

app.use('/client', router);

app.listen(port);
