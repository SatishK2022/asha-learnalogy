import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: [3, "Name must be at least 3 characters long"],
        max: [50, "Name must be at most 50 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    password: {
        type: String,
        required: true,
        select: false,
        match: [
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
        ],
        min: [8, "Password must be at least 8 characters long"],
        max: [50, "Password must be at most 50 characters long"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar: {
        type: String,
        default: "avatar.png",
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
}, { timestamps: true, versionKey: false });

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const User = model("User", userSchema);
export default User;