import express from "express";
import env from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import session from "express-session";
import passport from "passport"
import { Strategy } from "passport-local";

env.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
    secret: "secretword",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.session());

app.use(routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is now running!");
});