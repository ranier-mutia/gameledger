import db from "../config/database.js";

const userService = {
    getUser: async (email) => {

        const data = await db.query(`SELECT username, email, password FROM users WHERE email = $1`, [email]);
        return data.rows;

    },
    registerUser: async (username, email, hashedPassword) => {

        const data = await db.query(`INSERT INTO users (username, email, password, date_added) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0)) RETURNING *;`, [username, email, hashedPassword]);
        return data.rows;
    },
    registerGoogleUser: async (username, email) => {

        const data = await db.query(`INSERT INTO users (username, email, password, date_added) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0)) RETURNING username, password;`, [username, email, "Google"]);
        return data.rows;
    },
    resetPassword: async (email, hashedPassword) => {

        const data = await db.query(`UPDATE users SET password = $1 WHERE email = $2 RETURNING email;`, [hashedPassword, email]);
        return data.rows;
    }



}
export default userService;

