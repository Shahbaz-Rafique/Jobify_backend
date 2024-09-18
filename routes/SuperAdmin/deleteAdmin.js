const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/SuperAdmin/deleteAdmin'); 

router.get('/', adminController.deleteAdmin);

module.exports = router;
