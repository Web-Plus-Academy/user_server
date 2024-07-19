import generateTokenSetCookie from "../utils/generateToken.js";
import  getUserModelForBatch  from '../models/user.model.js'; // Adjust the path as per your project structure

// ------------User Login---------- ✅
import bcrypt from 'bcryptjs';

export const logInUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // let username = "FSDB101"

        let batchnumber =  username[4];

        // Get the model for the specified batch number
        const UserModel = getUserModelForBatch(batchnumber);

        // Find the user in the specified collection
        const user = await UserModel.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.json({ success: false, message: "Invalid Username" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        // Generate token and set cookie (example function, replace with your own implementation)
        generateTokenSetCookie(user._id, batchnumber, res);

        // Log success message
        const time = getCurrentDateTime();
        console.log({ message: "User Logged In", time, name: user.name, ID: username });

        // Respond with success message and user details
        res.status(200).json({ success: true, message: "Login Successful!", name: user.name, ID: user.username });

    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


// ------------User Logout---------- ✅
export const logOutUser = (req, res) => {
    let Data = req; 
    try {
        const time = getCurrentDateTime();
        console.log({ message: "User Logged Out", time, name:Data.user.name,ID: Data.user.username});
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully", success: true });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server error" })

    }
}

// --------------- POD Submission ----------- 

export const incrementPodCount = async (req, res) => {
  try {
    const { username, batchnumber } = req.user; // Assuming req.user contains user details

    const UserModel = getUserModelForBatch(batchnumber);
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure the POD submission status is only set if it hasn't been set today
    // const now = new Date();
    // const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000); // End of today

    // if (user.podSubmissionStatus && user.podSubmissionDate >= startOfToday && user.podSubmissionDate < endOfToday) {
    //   return res.status(400).json({ success: false, message: "POD already submitted today" });
    // }

    // Increment POD count and update submission status
    user.POD++;
    user.podSubmissionStatus = true;

    await user.save();

    console.log('POD count incremented successfully');
    const time = new Date().toISOString(); // Example of current date-time
    console.log({ message: "POD Submitted", time, name: req.user.name, ID: req.user.username });

    res.status(200).json({ message: "POD Submitted", success: true, podSubmissionStatus : true });
  } catch (error) {
    console.error("Error in POD Submission:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};



function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

