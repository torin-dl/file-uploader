import { Router } from "express";
import fileController from "../controllers/fileController.js";
import multer from "../config/multer.js";

const router = Router();

router.get("/", fileController.getFiles);
router.get("/upload", fileController.uploadGet);
router.post("/upload", multer.upload.single("file"), fileController.uploadPost);
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
router.get("/view-file/:id", fileController.viewFileGet);

export default router;
