import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import { prisma } from "../lib/prisma.js";

const validateSignUp = [body("username").trim(), body("password").trim()];
const validateLogIn = [body("username").trim(), body("password").trim()];

function getFiles(req, res) {
    res.render("index", { user: req.user });
}

function uploadGet(req, res) {
    res.render("upload", { user: req.user });
}

async function uploadPost(req, res) {
    // store req.file.path in db
    // file is already stored to public/uploads via multer in router
}

async function signUpGet(req, res) {
    res.render("sign-up");
}

const signUpPost = [
    validateSignUp,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up", {
                errors: errors.array(),
            });
        }
        const { username, password } = matchedData(req);
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                },
            });

            res.redirect("/");
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
];

const logIn = [
    validateLogIn,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
    }),
];

function logOut(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

export default { getFiles, uploadGet, uploadPost, signUpGet, signUpPost, logIn, logOut };
