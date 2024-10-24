import express from "express";
import { getAllEmp, addEmp, updateEmp, deleteEmp, uploadProfilePic, deleteProfilePic } from "../controller/userController.js";
const router=express.Router();

router.get("/getAll",getAllEmp);
router.post("/addEmp",addEmp);
router.put("/emp/:empId",updateEmp);
router.delete("/emp/:empId",deleteEmp);

// Route to upload a profile picture
router.post('/emp/uploadProfilePic/:empId', uploadProfilePic);

// Route to delete the profile picture
router.delete('/emp/deleteProfilePic/:empId', deleteProfilePic);

export default router;