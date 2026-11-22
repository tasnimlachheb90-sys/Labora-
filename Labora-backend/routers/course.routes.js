
const express = require("express");
const router = express.Router();

const Course = require("../models/course.model");

// GET : afficher tous les cours
router.get("/", async (req, res) => {
    console.log("NEW GET COURSES ROUTE EXECUTED");

    try {
        const courses = await Course.findAll();

        res.status(200).json({
            message: "Courses retrieved successfully",
            status: "success",
            data: courses
        });

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving courses",
            error: error.message
        });
    }
});

// POST : ajouter un cours
router.post("/", async (req, res) => {
    try {
        const { title, description, instructor, duration } = req.body;

        const course = await Course.create({
            title,
            description,
            instructor,
            duration
        });

        res.status(201).json({
            message: "Course created successfully",
            status: "success",
            data: course
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating course",
            error: error.message
        });
    }
});

// PUT : modifier un cours
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, instructor, duration } = req.body;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        await course.update({
            title,
            description,
            instructor,
            duration
        });

        res.status(200).json({
            message: "Course updated successfully",
            status: "success",
            data: course
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating course",
            error: error.message
        });
    }
});

// DELETE : supprimer un cours
router.delete("/:id", async (req, res) => {
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
            message: "Course deleted successfully",
            status: "success"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting course",
            error: error.message
        });
    }
});


module.exports = router;
