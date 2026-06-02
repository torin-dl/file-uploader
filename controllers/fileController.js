import db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
