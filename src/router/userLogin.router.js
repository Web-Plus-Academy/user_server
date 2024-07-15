import express from 'express';
import { logInUser, logOutUser, signUpUser } from '../controller/userLogin.controller.js';
// import UserProtectingRouter from '../middleware/UserProtectingRouter.js';

const router = express.Router();

router.post('/signupUser', signUpUser);  // ✅

router.post('/loginUser', logInUser);  // ✅

router.get('/logoutUser', logOutUser);  // ✅



export default router;