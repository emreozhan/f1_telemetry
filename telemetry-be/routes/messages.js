var express = require('express');
var router = express.Router();

module.exports = (messages) => {
    router.get('/', (req, res) => {
        //console.log(messages[0])

        //console.log(messages[0].message)

        res.send(messages[0].message);
    });

    return router;
};
