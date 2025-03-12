import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: [3, "Name must be at least 3 characters long"],
        max: [50, "Name must be at most 50 characters long"],
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    phone: {
        type: String,
        trim: true,
        min: [10, "Phone number must be at least 10 digits long"],
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        min: [3, "Subject must be at least 3 characters long"],
    },
    message: {
        type: String,
        required: true,
        trim: true,
        min: [10, "Message must be at least 10 characters long"],
    },
}, { timestamps: true, versionKey: false });

const Contact = model("Contact", contactSchema);
export default Contact;