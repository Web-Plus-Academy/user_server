import jwt from 'jsonwebtoken';

const generateTokenSetCookie = (userId, batchnumber, res) => {
    const token = jwt.sign({ userId, batchnumber }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.cookie("jwt", token, {
        maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
        httpOnly: true, // Makes the cookie accessible only through HTTP(S), not JavaScript
        sameSite: "strict", // Ensures the cookie is sent only with requests from the same site
        secure: process.env.NODE_ENV !== "development", // Sends the cookie only over HTTPS in production
        domain: new URL(process.env.FRONTEND_URL).hostname // Set your domain here
    });
};

export default generateTokenSetCookie;
