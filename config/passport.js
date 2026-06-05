import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
            const match = await bcrypt.compare(password, user.password);

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
