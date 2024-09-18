const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/getJobs');

router.get('/', adminController.getJobs);

module.exports = router;
