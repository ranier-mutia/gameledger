import db from "../config/database.js";

const userService = {
    users: async (req, res) => {

        const data = await db.query("SELECT * FROM users");
        return data.rows;

    }



}
export default userService;

