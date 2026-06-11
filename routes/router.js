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

router.get("/", fileController.getFiles);
router.get("/upload", fileController.uploadGet);
router.post("/upload", upload.single("file"), fileController.uploadPost);
router.get("/sign-up", fileController.signUpGet);
router.post("/sign-up", fileController.signUpPost);
router.post("/log-in", fileController.logIn);
router.get("/log-out", fileController.logOut);
router.get("/new-folder", fileController.newFolderGet);
router.post("/new-folder", fileController.newFolderPost);
router.get("/edit-folder", fileController.editFolderGet);
router.post("/edit-folder", fileController.editFolderPost);
router.get("/remove-folder", fileController.removeFolderGet);
router.post("/remove-folder", fileController.removeFolderPost);

export default router;
