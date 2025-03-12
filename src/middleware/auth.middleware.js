import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            status: 401,
            message: "Unauthorized Request - No Token Found"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Unauthorized Request - User Not Found"
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error Logging In User: ", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: error?.message || "Error Logging In User"
        })
    }
}

export { isLoggedIn }