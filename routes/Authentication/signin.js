const express = require('express');
const router = express.Router();
const authController = require('../../controllers/Authentication/Signin'); 

router.post('/', authController.signIn);

module.exports = router;
