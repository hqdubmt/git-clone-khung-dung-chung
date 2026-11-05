
const express = require('express');
const asyncHandler = require('../../../../utils/asyncHandler.utils');
const AuthControllers = require('../../controllers/auth.controllers');
const validateRegisterUser = require('../../../../middlewares/validateRegisterUser.middleware');

const router = express.Router();

// POST - Register User
router.post(
    '/register/user',
    validateRegisterUser,
    asyncHandler(AuthControllers.registerUser)
);

module.exports = router;
