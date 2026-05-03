import db from "../config/database.js"

const preferenceService = {
    getFavoriteData: async (email, gameID) => {
        const data = await db.query(`SELECT * FROM preferences WHERE type = 'favorite' AND email = $1 AND target_id = $2`, [email, gameID]);
        return data.rows;
    },
    addFavoriteData: async (email, gameID) => {
        const data = await db.query(`INSERT INTO preferences (email, target_id, date_added, type, liked) VALUES ($1, $2, to_timestamp(${Date.now()} / 1000.0), 'favorite', true) RETURNING id, email, target_id`, [email, gameID]);
        return data.rows;
    },
    deleteFavoriteData: async (id) => {
        const data = await db.query(`DELETE FROM preferences WHERE id = $1`, [id]);
        return data.rows;
    },
    getReviewLiked: async (id, email) => {
        const data = await db.query(`SELECT id, target_id, type, liked, email FROM preferences WHERE type = 'review' AND target_id = $1 AND email = $2`, [id, email]);
        return data.rows;
    },
    getReviewPreference: async (id) => {
        const data = await db.query(`SELECT id, type, liked FROM preferences WHERE type = 'review' AND id = $1`, [id]);
        return data.rows;
    },
    addReviewPreference: async (revID, email, liked) => {
        const data = await db.query(`INSERT INTO preferences (target_id, email, liked, date_added, type) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0), 'review') RETURNING id, liked`, [revID, email, liked]);
        return data.rows;
    },
    setReviewPreference: async (prefID, liked) => {
        const data = await db.query(`UPDATE preferences SET liked = $2 WHERE id = $1 RETURNING id, liked`, [prefID, liked]);
        return data.rows;
    },
    removeReviewPreference: async (id) => {
        const data = await db.query(`DELETE FROM preferences WHERE id = $1`, [id]);
        return data.rows;
    },
    getFavoriteGames: async (email) => {
        const data = await db.query(`SELECT target_id FROM preferences WHERE type = 'favorite' AND email = $1 ORDER BY date_added DESC LIMIT 6`, [email]);
        return data.rows;
    },
    getAllFavoriteGames: async (email, offset) => {
        const data = await db.query(`SELECT target_id FROM preferences WHERE type = 'favorite' AND email = $1 ORDER BY date_added DESC LIMIT 25 OFFSET $2`, [email, offset]);
        return data.rows;
    },
    getActivityPreferences: async (ids, email) => {
        const data = await db.query(`SELECT id, target_id FROM preferences WHERE type = 'activity' AND email = $2 AND target_id = any($1)`, [ids, email]);
        return data.rows;
    },
    addActivityPreference: async (actID, email) => {
        const data = await db.query(`INSERT INTO preferences (target_id, email, liked, date_added, type) VALUES ($1, $2, true, to_timestamp(${Date.now()} / 1000.0), 'activity') RETURNING id, liked`, [actID, email]);
        return data.rows;
    },
    removeActivityPreference: async (id) => {
        const data = await db.query(`DELETE FROM preferences WHERE id = $1`, [id]);
        return data.rows;
    },
}

export default preferenceService;