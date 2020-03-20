'use strict';
const express = require('express');
const handler = require('serve-handler');
const { convertArrayToCSV } = require('convert-array-to-csv');
const bodyParser = require('body-parser');
const fs = require('fs');


let app = express();
let router = express.Router()
let port = process.env.PORT || 3232;

router.use('/', express.static('.'));

app.post('/post', bodyParser.json(), function(req, res) {
    console.log(req.body);
    let csv = convertArrayToCSV(req.body, {
        header: ['delayMS', 'expectedArrow', 'selectedArrow']
    });
    console.log(csv);

    fs.writeFileSync('test_results/test_result.csv', csv);
});

module.exports = router;

app.use('/client', router);

app.listen(port);
