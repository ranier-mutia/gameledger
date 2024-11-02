import userService from "../services/userService.js";
import argon2 from 'argon2';
import passport from "passport"
import mailer from "../config/nodemailer.js";

const userController = {
    login:
        passport.authenticate('local', {
            successRedirect: 'login/success',
            failureRedirect: 'login/failure'
        })
    ,
    loginSuccess: async (req, res) => {

        if (req.isAuthenticated()) {
            res.status(200).send(req.user.username);
        }

    },
    loginFailure: async (req, res) => {

        res.status(401).send(false);

    },
    authUser: async (req, res) => {

        if (req.isAuthenticated()) {
            res.status(200).send({ username: req.user.username, email: req.user.email });
        }

    },
    googleAuth:
        passport.authenticate('google', {
            scope: ["email", "profile"]
        })
    ,
    googleAuthCallback:
        passport.authenticate('google', {
            successRedirect: "http://localhost:5173",
        })
    ,
    logout: async (req, res) => {

        req.logout((err) => {
            if (err) {
                console.log(err)
            }
            res.status(200).send(true);
        })

    },
    validateEmail: async (req, res) => {
        const { email, type } = req.body.data;

        const [user] = await userService.getUser(email);

        if (user) {
            if (type == "signup") {
                res.status(409).send(true);
            } else {
                res.status(200).send(true);
            }

        } else {
            if (type == "signup") {
                res.status(200).send(false);
            } else {
                res.status(404).send(false);
            }
        }

    },
    registerUser: async (req, res) => {
        const { username, email, password } = req.body.data;

        try {
            const hashedPassword = await argon2.hash(password);

            const [user] = await userService.registerUser(username, email, hashedPassword);

            req.login(user, (err) => {
                if (err) {
                    console.log(err)
                }
                res.redirect("login/success");
            })

        } catch (err) {
            console.log(err);
        }

    },
    forgotPassword: async (req, res) => {

        const email = req.body.email;

        const otp = Math.floor(100000 + (Math.random() * 900000))
        const expiryDate = Date.now() + 300000;

        try {

            const hashedOTP = await argon2.hash(otp.toString());

            req.session.otp = {
                code: hashedOTP,
                expiry: expiryDate
            }

        } catch (err) {
            console.log(err);
        }

        mailer(email, otp);

        res.status(200).send(true);

    },
    verifyOTP: async (req, res) => {

        const enteredOTP = req.body.OTP;
        const storedOTP = req.session.otp.code;
        const expiry = req.session.otp.expiry;


        if (await argon2.verify(storedOTP, enteredOTP)) {
            if (Date.now() < expiry) {
                res.status(202).send("valid");
            } else {
                res.status(200).send("expired");
            }
        } else {
            res.status(200).send("invalid");
        }


    },
    resetPassword: async (req, res) => {

        const email = req.body.email;
        const password = req.body.password;

        try {
            const hashedPassword = await argon2.hash(password);

            const success = await userService.resetPassword(email, hashedPassword);

            if (success) {
                res.status(200).send(true);
            } else {
                res.status(500).send(false);
            }

        } catch (err) {
            console.log(err);
        }

    }



}

export default userController;

