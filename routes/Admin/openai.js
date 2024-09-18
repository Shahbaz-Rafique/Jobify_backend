const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/openai');

router.post('/', adminController.generateCompletion);

module.exports = router;
