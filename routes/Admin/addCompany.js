const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/addCompany');

router.post('/', adminController.addCompany);

module.exports = router;
