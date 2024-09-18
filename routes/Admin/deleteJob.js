const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/deleteJob');

router.get('/', adminController.deleteJob);

module.exports = router;
