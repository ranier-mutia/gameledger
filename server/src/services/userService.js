import db from "../config/database.js";

const userService = {
    getUser: async (email) => {

        const data = await db.query(`SELECT id, username, email, password, profile_picture FROM users WHERE email = $1`, [email]);
        return data.rows;

    },
    getUserById: async (id) => {

        const data = await db.query(`SELECT id, username, email, profile_picture, date_added FROM users WHERE id = $1`, [id]);
        return data.rows;

    },
    registerUser: async (username, email, hashedPassword) => {

        const data = await db.query(`INSERT INTO users (username, email, password, date_added) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0)) RETURNING *;`, [username, email, hashedPassword]);
        return data.rows;
    },
    registerGoogleUser: async (username, email) => {

        const data = await db.query(`INSERT INTO users (username, email, password, date_added) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0)) RETURNING *;`, [username, email, "Google"]);
        return data.rows;
    },
    resetPassword: async (email, hashedPassword) => {

        const data = await db.query(`UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email;`, [hashedPassword, email]);
        return data.rows;
    },
    searchUsers: async (query) => {
        const searchPattern = `%${query}%`;
        const data = await db.query(`SELECT id, username, profile_picture, top_genres FROM users WHERE username ILIKE $1 LIMIT 5`, [searchPattern]);
        return data.rows;

    },
    searchAllUsers: async (query, offset = 0) => {
        const searchPattern = `%${query}%`;
        const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
        const data = await db.query(`SELECT id, username, profile_picture, top_genres FROM users WHERE username ILIKE $1 
        ORDER BY 
            CASE 
                WHEN username ILIKE $2 THEN 1 
                WHEN username ILIKE $2 || '%' THEN 2  
                ELSE 3
            END,
            username ASC,                        
            id ASC LIMIT 25 OFFSET $3`, [searchPattern, query, safeOffset]);
        return data.rows;

    },
    setTopGenres: async (email, topGenres) => {
        const data = await db.query(`UPDATE users SET top_genres = $1 WHERE email = $2`, [topGenres, email]);
        return data.rows;

    },
    getTopGenres: async (email) => {
        const data = await db.query(`SELECT top_genres FROM users WHERE email = $1`, [email]);
        return data.rows;

    }



}
export default userService;

