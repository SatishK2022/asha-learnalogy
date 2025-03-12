import { Router } from "express";
import { contact, getContacts } from "../controller/contact.controller.js";

const router = Router()

router
    .route("/")
    .post(contact)
    .get(getContacts)

export default router;