import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getCourse } from "../controller/course.controller.js";

const router = Router();

router
    .route("/")
    .post(createCourse)
    .get(getAllCourses)

router
    .route("/:id")
    .get(getCourse)
    .delete(deleteCourse)

export default router;