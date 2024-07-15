import bycrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenSetCookie from "../utils/generateToken.js";

// ------------User sign up---------- ✅
export const signUpUser = async (req, res) => {
    try {
        const {name, username, password } = req.body;
        const user = await User.findOne({  username });

        if (user) {
            return res.status(400).json({success:false, error: "User Already Exists" });
        }

        //Hashing the password
        const salt = await bycrypt.genSalt(10);
        const hashpassword = await bycrypt.hash(password, salt);

        const newUser = new User({
            name,
            password: hashpassword,
            username
        })

        if (newUser) {
            //Generate JWT tokens
            generateTokenSetCookie(newUser._id, res);
            await newUser.save();
            console.log("New User Created")
            res.status(201).json({
                success:true,
                name: newUser.name,
                ID: username
            })
        }
        else {
            res.status(400).json({success:false, message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({success:false, message: error.message })
    }
}

// ------------User Login---------- ✅
export const logInUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const ispasswordCorrect = await bycrypt.compare(password, user?.password || "");

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Username" });
        }

        if(!ispasswordCorrect){
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }

        generateTokenSetCookie(user._id, res);

        const time = getCurrentDateTime();

        console.log({message:"User Loged In", time: time, user: username});
        res.status(200).json({ success: true,message:"Login Successful !" , name:user.name, ID: user.username});

    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// ------------User Logout---------- ✅
export const logOutUser = (req, res) => {
    try {
        console.log("User Log Out");
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully", success: true });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server error" })

    }
}




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

