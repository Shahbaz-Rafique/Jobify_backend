const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/updateJob');

router.post('/', adminController.updateJob);

module.exports = router;
