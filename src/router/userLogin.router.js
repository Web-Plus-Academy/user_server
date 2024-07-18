import express from 'express';
import { logInUser, logOutUser } from '../controller/userLogin.controller.js';
import UserProtectingRouter from '../middleware/user.middleware.js';

const router = express.Router();

// router.post('/signupUser', signUpUser);  // ✅

router.post('/loginUser', logInUser);  // ✅

router.get('/logoutUser',UserProtectingRouter, logOutUser);  // ✅



export default router;