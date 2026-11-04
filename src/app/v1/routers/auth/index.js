
const express = require('express');
const asyncHandler = require('../../../../utils/asyncHandler.utils');
const AuthControllers = require('../../controllers/auth.controllers');

const router = express.Router();

// POST - Register User
router.post(
    '/register/user',
    asyncHandler(AuthControllers.registerUser)
);

module.exports = router;
