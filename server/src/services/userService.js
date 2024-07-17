import db from "../config/database.js";

const userService = {
    getUser: async (email) => {

        const data = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
        return data.rows;

    },
    registerUser: async (username, email, hashedPassword) => {

        const data = await db.query(`INSERT INTO users (username, email, password) VALUES ('${username}','${email}','${hashedPassword}');`);
        return data.rowCount;
    }



}
export default userService;

