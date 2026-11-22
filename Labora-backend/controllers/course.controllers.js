
const Course = require("../models/course.model");

// ADD COURSE
exports.addCourse = async (req, res) => {
    try {
        const { title, description, instructor, duration } = req.body;

        if (!title || !description || !instructor || !duration) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const course = await Course.create({
            title,
            description,
            instructor,
            duration
        });

        res.status(201).json({
            message: "Course added successfully",
            course
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding course",
            error: error.message
        });
    }
};

// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();

        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving courses",
            error: error.message
        });
    }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        await course.update(req.body);

        res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating course",
            error: error.message
        });
    }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        await course.destroy();

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting course",
            error: error.message
        });
    }
};
