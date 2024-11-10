import generateTokenSetCookie from "../utils/generateToken.js";
import  getUserModelForBatch  from '../models/user.model.js'; // Adjust the path as per your project structure
import bcrypt from 'bcryptjs';

// ------------User Signup---------- ✅
export const signUpUser = async (req, res) => {
    try {
        const { username, password,batchnumber,email, name } = req.body;
        // const batchnumber = parseInt(username.slice(4)); // Extracting batch number from username

        // Get the model for the specified batch number
        const UserModel = getUserModelForBatch(batchnumber);

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with full schema fields
        const newUser = new UserModel({
            username,
            password: hashedPassword,
            name,
            batchnumber,
            email,
        });

        await newUser.save();

        // Generate token and set cookie
        generateTokenSetCookie(newUser._id, batchnumber, res);

        const time = getCurrentDateTime();
        console.log({ message: "User Signed Up", time, name: newUser.name, ID: username });

        res.status(201).json({ success: true, message: "User Registered Successfully", name: newUser.name, ID: newUser.username });

    } catch (error) {
        console.log("Error in signUpUser controller", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};



// ------------User Login---------- ✅
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
    // let Data = req; 
    try {
        // const time = getCurrentDateTime();
        // console.log({ message: "User Logged Out", time, name:Data.user.name,ID: Data.user.username});
        // res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully", success: true });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server error" })
    }
}

// --------------- Change password ---------------
export const changePassword = async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;

        console.log(username)
        let batchnumber = username[4];

        // Get the model for the specified batch number
        const UserModel = getUserModelForBatch(batchnumber);

        // Find the user in the specified collection
        const user = await UserModel.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.json({ success: false, message: "Invalid Username" });
        }

        // Verify old password
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Old Password" });
        }

        // Encrypt the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        // Log success message
        const time = getCurrentDateTime();
        console.log({ message: "Password Changed Successfully", time, name: user.name, ID: username });

        // Respond with success message
        res.status(200).json({ success: true, message: "Password Changed Successfully!" });

    } catch (error) {
        console.log("Error in changePassword controller", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


// --------------- POD Submission ----------- 

export const incrementPodCount = async (req, res) => {
  try {
    // const { username, batchnumber } = req.user; // Assuming req.user contains user details

    const username = req.body.id;
    let batchnumber =  username[4];
    // console.log(batchnumber)

    const UserModel = getUserModelForBatch(batchnumber);
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.POD++;
    user.podSubmissionStatus = true;

    await user.save();

    console.log('POD count incremented successfully');
    // const time = new Date().toISOString(); // Example of current date-time
    // console.log({ message: "POD Submitted", time, name: req.user.name, ID: req.user.username });

    res.status(200).json({ message: "POD Submitted", success: true, podSubmissionStatus : user.podSubmissionStatus });
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

