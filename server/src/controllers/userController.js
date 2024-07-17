import userService from "../services/userService.js";
import argon2 from 'argon2';

const userController = {
    validateUser: async (req, res) => {
        const { email, password } = req.body.data;

        const [user] = await userService.getUser(email);

        if (user) {

            try {
                if (await argon2.verify(user.password, password)) {
                    res.status(200).send(true);
                } else {
                    res.status(401).send(false);
                }
            } catch (err) {
                console.log(err);
            }

        } else {
            res.status(401).send(false);
        }

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

            const result = await userService.registerUser(username, email, hashedPassword);

            if (result == 1) {
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

