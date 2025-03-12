import { Schema, model } from "mongoose";

const courseSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    language: {
        type: String
    },
    certification: {
        type: String
    },
    enrollment: {
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        seatsAvailable: {
            type: Number
        }
    },
    skillsGained: [{
        type: String
    }],
    prerequisites: [{
        type: String
    }],
    modeOfDelivery: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    curriculum: [{
        sectionTitle: {
            type: String,
            required: true
        },
        lessons: [{
            lessonTitle: {
                type: String,
                required: true
            },
            lessonDescription: {
                type: String,
                required: true
            },
            // videoLink: {
            //     type: String
            // },
            // duration: {
            //     type: String
            // },
        }]
    }],
    // instructor: {
    //     name: {
    //         type: String
    //     },
    //     bio: {
    //         type: String
    //     },
    //     image: {
    //         type: String
    //     }
    // },
    // reviews: [{
    //     studentName: {
    //         type: String
    //     },
    //     rating: {
    //         type: Number,
    //         min: 1, max: 5
    //     },
    //     review: {
    //         type: String
    //     }
    // }]
}, { timestamps: true });

const Course = model('Course', courseSchema);
export default Course;
