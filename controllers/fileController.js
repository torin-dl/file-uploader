import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import { prisma } from "../lib/prisma.js";

const validateSignUp = [body("username").trim(), body("password").trim()];
const validateLogIn = [body("username").trim(), body("password").trim()];
const validateNewFolder = [body("newFolder").trim()];
const validateEditFolder = [body("folderEdit").trim(), body("folderFile").trim(), body("nameChange").trim()];
const validateRemoveFolder = [body("deleteFolder").trim()];

async function getFiles(req, res) {
    const allFolders = await prisma.folder.findMany({
        include: {
            files: true,
            user: true,
        },
    });

    res.render("index", { user: req.user });
}

function uploadGet(req, res) {
    res.render("upload", { user: req.user });
}

async function uploadPost(req, res, next) {
    try {
        const relativePath = `uploads/${req.file.filename}`;
        await prisma.file.create({
            data: {
                path: req.file.path,
                relativePath,
                userId: req.user.id,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
            },
        });
        res.redirect("/");
    } catch (error) {
        console.log(error);
        next(error);
    }
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

function newFolderGet(req, res) {
    res.render("new-folder", { user: req.user });
}

const newFolderPost = [
    validateNewFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("new-folder", {
                errors: errors.array(),
                user: req.user,
            });
        }
        const { newFolder } = matchedData(req);

        try {
            await prisma.folder.upsert({
                where: { name_userId: { name: newFolder, userId: req.user.id } },
                update: {},
                create: {
                    name: newFolder,
                    user: { connect: { id: req.user.id } },
                },
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
        res.redirect("/");
    },
];

function editFolderGet(req, res) {
    res.render("edit-folder", { user: req.user });
}

const editFolderPost = [
    validateEditFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("edit-folder", {
                errors: errors.array(),
                user: req.user,
            });
        }
        const { folderEdit, folderFile, nameChange } = matchedData(req);

        try {
            await prisma.folder.update({
                where: { name_userId: { name: folderEdit, userId: req.user.id } },
                data: {
                    name: nameChange ? nameChange : prisma.skip,
                    files: folderFile
                        ? {
                              connect: { id: parseInt(folderFile) },
                          }
                        : prisma.skip,
                },
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
        res.redirect("/");
    },
];

function removeFolderGet(req, res) {
    res.render("remove-folder", { user: req.user });
}

const removeFolderPost = [
    validateRemoveFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("remove-folder", {
                errors: errors.array(),
                user: req.user,
            });
        }
        const { deleteFolder } = matchedData(req);

        try {
            await prisma.folder.delete({
                where: { name_userId: { name: deleteFolder, userId: req.user.id } },
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
        res.redirect("/");
    },
];

async function viewFileGet(req, res, next) {
    const file = await prisma.file.findUnique({
        where: {
            id: parseInt(req.params.id),
        },
    });
    if (!file) {
        const error = new Error("file not found");
        error.statusCode = 400;
        return next(error);
    }

    res.render("view-file", {
        file,
        user: req.user,
    });
}

export default {
    getFiles,
    uploadGet,
    uploadPost,
    signUpGet,
    signUpPost,
    logIn,
    logOut,
    newFolderGet,
    newFolderPost,
    editFolderGet,
    editFolderPost,
    removeFolderGet,
    removeFolderPost,
    viewFileGet,
};
