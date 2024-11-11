import { UserModel } from "../postgres/postgres.js";
import fs from 'fs';
import path from 'path';

// Multer Configuration for File Upload
import multer from 'multer';

// Define the storage location for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Destination folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
    }
});

// Initialize the upload middleware
const upload = multer({ storage: storage }).single('profilePic');


// Fetch all employees
export const getAllEmp = async (req, res) => {
    try {
        const users = await UserModel.findAll();
        if (users.length === 0) {
            return res.status(200).json({ error: "Users not found" });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Add a new employee
export const addEmp = async (req, res) => {
    const { name, email, designation, empId } = req.body;
    try {
        const emp = await UserModel.findOne({ where: { empId } });
        if (emp === null) {
            await UserModel.create(req.body);
            return res.status(201).json({ message: "Employee added successfully" });
        }
        return res.status(200).json({ message: "Employee already exists" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update employee details
export const updateEmp = async (req, res) => {
    const empId = req.params.empId;
    try {
        const [updated] = await UserModel.update(req.body, { where: { empId } });
        if (updated === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete an employee
export const deleteEmp = async (req, res) => {
    const empId = req.params.empId;
    try {
        const emp = await UserModel.findOne({ where: { empId } });
        if (!emp) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await emp.destroy();
        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to upload profile picture
export const uploadProfilePic = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "File upload failed" });
        }

        const empId = req.params.empId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const emp = await UserModel.findOne({ where: { empId: empId } });

            if (emp == null) {
                return res.status(404).json({ message: "Employee not found" });
            }

            // Store the file path in the database
            emp.profilePicture = file.path;
            await emp.save();

            return res.status(200).json({
                message: "Profile picture uploaded successfully",
                filePath: file.path,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
};

// Controller to delete profile picture
export const deleteProfilePic = async (req, res) => {
    const empId = req.params.empId;

    try {
        const emp = await UserModel.findOne({ where: { empId: empId } });

        if (emp == null) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Delete the profile picture from the server
        if (emp.profilePicture) {
            fs.unlink(path.resolve(emp.profilePicture), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        // Remove the file path from the database
        emp.profilePicture = null;
        await emp.save();

        return res.status(200).json({ message: "Profile picture deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
