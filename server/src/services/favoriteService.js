import db from "../config/database.js"

const favoriteService = {
    getFavoriteData: async (email, gameID) => {
        const data = await db.query(`SELECT * FROM favorites WHERE email = $1 AND game_id = $2`, [email, gameID]);
        return data.rows;
    },
    addFavoriteData: async (email, gameID) => {
        const data = await db.query(`INSERT INTO favorites (email, game_id, date_added) VALUES ($1, $2, to_timestamp(${Date.now()} / 1000.0)) RETURNING id, email, game_id`, [email, gameID]);
        return data.rows;
    },
    deleteFavoriteData: async (id) => {
        const data = await db.query(`DELETE FROM favorites WHERE id = $1`, [id]);
        return data.rows;
    }
}

export default favoriteService;