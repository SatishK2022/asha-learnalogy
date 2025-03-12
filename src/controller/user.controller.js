import logger from "../logger.js";
import User from "../models/user.model.js";

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if ([name, email, password].some((value) => value === "" || value === null || value === undefined)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "All fields are required",
            })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(201).json({
            success: true,
            status: 201,
            message: "User registered successfully",
            data: userWithoutPassword
        })
    } catch (error) {
        logger.error("Error while registering user:", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error while registering user",
        })
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if ([email, password].some((value) => value === "" || value === null || value === undefined)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "All fields are required",
            })
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "User not found",
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Invalid credentials",
            });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        const token = user.generateAccessToken();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        };

        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                status: 200,
                message: "User logged in successfully",
                data: userWithoutPassword,
                token
            })
    } catch (error) {
        logger.error("Error while logging in user:", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error while logging in user",
        });
    }
}

const logoutUser = async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    }

    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json({
            success: true,
            status: 200,
            message: "User logged out successfully",
        });
}

const profile = async (req, res) => {
    console.log("User Profile: ", req.user._id)

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: "User profile fetched successfully",
            data: user
        })
    } catch (error) {
        logger.error("Error while getting user profile");
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error while getting user profile",
        })
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "User not found",
            })
        }

        const isPasswordValid = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Invalid credentials",
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Password changed successfully",
        })
    } catch (error) {
        logger.error("Error while changing password");
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error while changing password",
        })
    }
}

export { registerUser, loginUser, logoutUser, profile, changePassword };