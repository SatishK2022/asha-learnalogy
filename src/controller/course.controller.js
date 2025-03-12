import logger from "../logger.js";
import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
    const { title, description, duration, level, language, certification, enrollment, skillsGained, prerequisites, modeOfDelivery, curriculum } = req.body;

    try {
        if (!title || !description || !duration || !level) {
            return res.status(400).json({
                success: false,
                message: "Title, description, duration, and level are required."
            });
        }

        const existingCourse = await Course.findOne({ title });

        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: "Course with the same title already exists"
            });
        }

        const courseId = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

        const newCourse = new Course({
            courseId,
            title,
            description,
            duration,
            level,
            language,
            certification,
            enrollment,
            skillsGained,
            prerequisites,
            modeOfDelivery,
            curriculum
        });

        const savedCourse = await newCourse.save();

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: savedCourse
        });
    } catch (error) {
        logger.error("Error while creating course:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while creating the course"
        });
    }
};

export const getCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        const course = await Course.find({ courseId });

        if (course.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: course
        });
    } catch (error) {
        logger.error("Error while getting course:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while getting the course"
        });
    }
}

export const deleteCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        const existingCourse = await Course.find({ courseId });

        if (existingCourse.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        await Course.deleteOne({ courseId });

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        logger.error("Error while deleting course:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while deleting the course"
        });
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses
        })
    } catch (error) {
        logger.error("Error while getting all courses:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An error occurred while getting all courses"
        })
    }
}