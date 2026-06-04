import express from "express";
import path from "node:path";
import router from "./routes/router.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "../generated/prisma/index.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    session({
        secret: "dogs",
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(new PrismaClient(), {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
        }),
    }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
});
