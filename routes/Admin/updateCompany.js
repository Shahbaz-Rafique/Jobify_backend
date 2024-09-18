const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/UpdateCompany');

router.post('/', adminController.updateCompany);

module.exports = router;
