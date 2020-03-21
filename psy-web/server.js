'use strict';
const express = require('express');
const { convertArrayToCSV } = require('convert-array-to-csv');
const bodyParser = require('body-parser');
const expressip = require('express-ip');
const fs = require('fs');


let app = express();
let router = express.Router()
let port = process.env.PORT || 3232;

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

function encodeUtf8(s) {
    return unescape(encodeURIComponent(s));
}

makeDirIfNotExists('test_results');

app.post('/post', bodyParser.json(), function (req, res) {

    console.log(req.body);
    let header = ['זמן תגובה', 'תשובה נכונה / טעות', 'האות שהושמעה', 'תנאי', 'אימון / מבחן', 'התשובה הנכונה', 'התשובה בפועל', 'אחוז תשובות נכונות'];
    let headerEncoded = [];
    for (const v of header) {
        headerEncoded.push(encodeUtf8(v));
    }
    let csv = convertArrayToCSV(req.body, {
        header: headerEncoded
    });
    console.log(csv);

    let csvBom = '\ufeff' + csv;
    let fileName = 'test_results/' + replaceAll(req.ipInfo.ip, ':', '_') + 'test_result.csv';
    fs.writeFileSync(fileName, csvBom);

    res.send('');
});

module.exports = router;

app.use('/client', router);

app.listen(port);
