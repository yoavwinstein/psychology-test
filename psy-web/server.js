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

app.post('/post', bodyParser.json(), function (req, res) {

    console.log(req.body);
    let csv = convertArrayToCSV(req.body, {
        header: ['delay in milliseconds', 'expected arrow', 'selected arrow', 'condition', 'is practice']
    });
    console.log(csv);
    
    fs.writeFileSync('test_results/' + replaceAll(req.ipInfo.ip, ':', '_') + 'test_result.csv', csv);
});

module.exports = router;

app.use('/client', router);

app.listen(port);
