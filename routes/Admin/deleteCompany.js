const express = require('express');
const router = express.Router();
const CompanyController = require('../../controllers/Admin/deleteCompany');

router.get('/', CompanyController.deleteCompany);

module.exports = router;
