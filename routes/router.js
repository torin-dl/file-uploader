import { Router } from "express";
import fileController from "../controllers/fileController.js";
import multer from "multer";

const router = Router();

const upload = multer({
    dest: "../public/uploads/",
    fileFilter: (req, file, cb) => {
        const isAllowed =
            file.mimetype.startsWith("text/") ||
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/") ||
            file.mimetype.startsWith("application/");
        if (isAllowed) {
            cb(null, true);
        } else {
            cb(new Error("File type not allowed"));
        }
    },
    limits: { fileSize: 1024 * 1024 * 10 },
});

router.get("/upload", fileController.uploadGet);
router.post("/upload", upload.single("file"), fileController.uploadPost);
export default router;
