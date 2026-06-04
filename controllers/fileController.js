import db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";

function uploadGet(req, res) {
    res.render("upload");
}

async function uploadPost(req, res) {
    // store req.file.path in db
    // file is already stored to public/uploads via multer in router
}

export default { uploadGet, uploadPost };
