import logger from "../logger.js";
import Contact from "../models/contact.model.js";

export const contact = async (req, res) => {
    const { name, email, phone, subject, message } = req.body

    try {
        if ([name, email, subject, message].some((value) => value === "" || value === null || value === undefined)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "All fields are required"
            })
        }

        await Contact.create({
            name,
            email,
            phone,
            subject,
            message
        })

        return res.status(201).json({
            success: true,
            status: 201,
            message: "Contact details added successfully",
        })
    } catch (error) {
        logger.error("Error while adding contact details", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: error?.message || "Error while adding contact details"
        })
    }
}

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        if (contacts.length === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "No contact details found"
            })
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Contact details fetched successfully",
            data: contacts
        })
    } catch (error) {
        logger.error("Error while getting contact details", error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: error?.message || "Error while getting contact details"
        })
    }
}