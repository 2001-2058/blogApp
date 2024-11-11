import express from 'express';
import { getAllEmp, addEmp, updateEmp, deleteEmp, uploadProfilePic, deleteProfilePic } from "../controller/userController.js";
import { upload } from "../middleware/fileUpload.js";

const router = express.Router();

router.get("/getAll", getAllEmp);
router.post("/addEmp", addEmp);
router.put("/emp/:empId", updateEmp);
router.delete("/emp/:empId", deleteEmp);

// Route to upload a profile picture
router.post('/emp/uploadProfilePic/:empId', upload.single('profilePic'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    const empId = req.params.empId;
    const filePath = req.file.path; // Path to the uploaded file
  
    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      empId: empId,
      filePath: filePath,
    });
  });

// Route to delete the profile picture
router.delete('/emp/deleteProfilePic/:empId', deleteProfilePic);

export default router;
