const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/SuperAdmin/getAdmins');

router.get('/', adminController.getAdmins);

module.exports = router;
