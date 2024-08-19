import db from "../config/database.js";

const userService = {
    getUser: async (email) => {

        const data = await db.query(`SELECT username, password FROM users WHERE email = $1`, [email]);
        return data.rows;

    },
    registerUser: async (username, email, hashedPassword) => {

        const data = await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`, [username, email, hashedPassword]);
        return data.rows;
    },
    registerGoogleUser: async (username, email) => {

        const data = await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, password;`, [username, email, "Google"]);
        return data.rows;
    },
    resetPassword: async (email, hashedPassword) => {

        const data = await db.query(`UPDATE users SET password = $1 WHERE email = $2 RETURNING email;`, [hashedPassword, email]);
        return data.rows;
    }



}
export default userService;

