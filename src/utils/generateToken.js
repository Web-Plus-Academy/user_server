import jwt from 'jsonwebtoken';

const generateTokenSetCookie = (userId, batchnumber, res) => {
    const token = jwt.sign({ userId, batchnumber }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.cookie("jwt", token, {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });
}

export default generateTokenSetCookie;



