const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/SuperAdmin/addAdmin');

router.post('/', adminController.addAdmin);

module.exports = router;
