const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/SuperAdmin/updateAdmin');

router.post('/', adminController.updateAdmin);

module.exports = router;
