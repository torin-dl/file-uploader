import { Router } from "express";
import fileController from "../controllers/fileController.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "./public/uploads/" });

router.get("/upload", fileController.uploadGet);
router.post("/upload", upload.single("file"), fileController.uploadPost);
export default router;
