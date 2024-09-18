const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/addjob');

router.post('/', adminController.addJob);

module.exports = router;
