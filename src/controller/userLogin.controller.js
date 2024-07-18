import generateTokenSetCookie from "../utils/generateToken.js";
import  {getUserModelForBatch}  from '../models/user.model.js'; // Adjust the path as per your project structure

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
            return res.status(400).json({ success: false, message: "Invalid Username" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }

        // Generate token and set cookie (example function, replace with your own implementation)
        generateTokenSetCookie(user._id,batchnumber, res);

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

