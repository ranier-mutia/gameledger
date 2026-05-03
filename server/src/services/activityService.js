import db from "../config/database.js"

const activityService = {
    getUserActivities: async (email) => {
        const data = await db.query(`SELECT * FROM activities WHERE email = $1 ORDER BY date_added DESC LIMIT 10`, [email]);
        return data.rows;

    },
    getAllUserActivities: async (email, offset) => {
        const data = await db.query(`SELECT * FROM activities WHERE email = $1 ORDER BY date_added DESC LIMIT 21 OFFSET $2`, [email, offset]);
        return data.rows;

    },
    getAllUserActivitiesFilter: async (email, filter, offset) => {
        const data = await db.query(`SELECT * FROM activities WHERE email = $1 AND status = $2 ORDER BY date_added DESC LIMIT 21 OFFSET $3`, [email, filter, offset]);
        return data.rows;

    },
    getUserActivity: async (listID) => {
        const data = await db.query(`SELECT status FROM activities WHERE list_id = $1 ORDER BY date_added DESC LIMIT 1`, [listID]);
        return data.rows;

    },
    addUserActivity: async (gameID, email, status, listID) => {
        const data = await db.query(`INSERT INTO activities (game_id, email, status, list_id, date_added) VALUES ($1, $2, $3, $4, to_timestamp(${Date.now()} / 1000.0))`, [gameID, email, status, listID]);
        return data.rows;
    },
    deleteUserActivities: async (listID) => {
        const data = await db.query(`DELETE FROM activities WHERE list_id = $1`, [listID]);
        return data.rows;
    },
    addRating: async (id) => {
        const data = await db.query(`UPDATE activities SET likes = likes + 1 WHERE id = $1 RETURNING "likes"`, [id]);
        return data.rows;
    },
    removeRating: async (id) => {
        const data = await db.query(`UPDATE activities SET likes = likes - 1 WHERE id = $1 RETURNING "likes"`, [id]);
        return data.rows;
    },


}

export default activityService;