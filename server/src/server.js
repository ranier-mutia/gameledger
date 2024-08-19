import express from "express";
import env from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import session from "express-session";
import passport from "passport"
import passportConfig from "./config/passport.js";

env.config();

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passportConfig();

app.use(routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is now running!");
});