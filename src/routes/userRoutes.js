import express from "express";
import { upload } from "../middleware/multer.js";
import { updateUserAvatar } from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.patch(
  "/user/me/avatar",
  authenticate,         
  upload.single("avatar"),   
  updateUserAvatar           
);

export default router;
