'use strict';

var express = require('express');
var controller = require('./image.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;