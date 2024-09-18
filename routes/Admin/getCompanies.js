const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/getCompanies');

router.get('/', adminController.getCompanies);

module.exports = router;
