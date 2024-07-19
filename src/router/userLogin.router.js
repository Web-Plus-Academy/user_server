import express from 'express';
import { logInUser, logOutUser, incrementPodCount } from '../controller/userLogin.controller.js';
import UserProtectingRouter from '../middleware/user.middleware.js';
import axios from 'axios'
import getUserModelForBatch from '../models/user.model.js';

const router = express.Router();

// router.post('/signupUser', signUpUser);  // ✅

router.post('/loginUser', logInUser);  // ✅

router.get('/logoutUser', UserProtectingRouter, logOutUser);  // ✅

router.get('/podSubmit', UserProtectingRouter, incrementPodCount)



// POD assigner 
router.get('/problems',UserProtectingRouter, async (req, res) => {
  try {
    const response = await axios.get('https://leetcode.com/api/problems/algorithms/')
    const { username, batchnumber } = req.user; // Assuming req.user contains user details
    // console.log(req.user)

    const UserModel = getUserModelForBatch(batchnumber);
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({data:response.data,podSubmissionStatus:user.podSubmissionStatus});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching problems');
  }
});




export default router;




// user: {
//   _id: new ObjectId('669a11c843171494c073f476'),
//   name: 'Chaitra',
//   username: 'FSDB101',
//   batchnumber: 1,
//   POD: 12,
//   createdAt: 2024-07-19T07:12:08.994Z,
//   updatedAt: 2024-07-19T08:05:59.175Z,
//   __v: 0,
//   podSubmissionStatus: true
// },