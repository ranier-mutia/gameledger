import db from "../config/database.js"

const listService = {
    getListData: async (email, id) => {
        const data = await db.query(`SELECT id, status, score, TO_CHAR(date_start, 'YYYY-MM-dd') as start_date, TO_CHAR(date_end, 'YYYY-MM-dd') as end_date FROM lists WHERE email = $1 AND game_id = $2`, [email, id]);
        return data.rows;
    },
    addListData: async (gameID, email, status, score, dateStart, dateEnd) => {
        const data = await db.query(`INSERT INTO lists (game_id, email, status, score, date_start, date_end, date_added) VALUES ($1,$2,$3,$4,$5,$6,to_timestamp(${Date.now()} / 1000.0))`, [gameID, email, status, score, dateStart, dateEnd]);
        return data.rows;
    },
    updateListData: async (id, status, score, dateStart, dateEnd) => {
        const data = await db.query(`UPDATE lists SET status = $1, score = $2, date_start = $3, date_end = $4 WHERE id = $5`, [status, score, dateStart, dateEnd, id]);
        return data.rows;
    },
    deleteListData: async (id) => {
        const data = await db.query(`DELETE FROM lists WHERE id = $1`, [id]);
        return data.rows;
    },
    setStatus: async (gameID, email, status) => {
        const data = await db.query(`INSERT INTO lists (game_id, email, status, date_added) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`, [gameID, email, status]);
        return data.rows;
    },
    updateStatus: async (id, status) => {
        const data = await db.query(`UPDATE lists SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        return data.rows;
    },
    getListScore: async (id) => {
        const data = await db.query(`SELECT id, score FROM lists WHERE id = $1`, [id]);
        return data.rows;
    },

}

export default listService