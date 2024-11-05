import db from "../config/database.js"

const reviewService = {
    getReviews: async (offset) => {
        const data = await db.query(`SELECT reviews.id, reviews.game_id, reviews.email, reviews.score, reviews.summary, reviews.like, reviews.date_added, users.username FROM reviews INNER JOIN users ON reviews.email = users.email ORDER BY reviews.date_added DESC LIMIT 17 OFFSET ${offset}`);
        return data.rows;

    },
    getReview: async (id) => {
        const data = await db.query(`SELECT reviews.id, reviews.game_id, reviews.email, reviews.score, reviews.summary, reviews.review, reviews.like, reviews.dislike, reviews.date_added, users.username FROM reviews INNER JOIN users ON reviews.email = users.email WHERE reviews.id = $1`, [id]);
        return data.rows;
    },
    getReviewData: async (id, email) => {
        const data = await db.query(`SELECT id, game_id, email FROM reviews WHERE game_id = $1 AND email = $2`, [id, email]);
        return data.rows;
    },
    addReview: async (gameID, email, score, summary, review) => {
        const data = await db.query(`INSERT INTO reviews (game_id, email, score, summary, review, date_added) VALUES ($1, $2, $3, $4, $5, to_timestamp(${Date.now()} / 1000.0)) RETURNING id`, [gameID, email, score, summary, review]);
        return data.rows;
    },
    editReview: async (id, score, summary, review) => {
        const data = await db.query(`UPDATE reviews SET score = $2, summary = $3, review = $4 WHERE id = $1 RETURNING id`, [id, score, summary, review]);
        return data.rows;
    },
    deleteReview: async (id) => {
        const data = await db.query(`DELETE FROM reviews WHERE id = $1`, [id]);
        return data.rows;
    },
    addRating: async (id, rating) => {
        const data = await db.query(`UPDATE reviews SET "${rating}" = "${rating}" + 1 WHERE id = ${id} RETURNING "like", "dislike"`);
        return data.rows;
    },
    changeRating: async (id, rating) => {
        const data = await db.query(`UPDATE reviews SET "${rating.dec}" = "${rating.dec}" - 1, "${rating.inc}" = "${rating.inc}" + 1 WHERE id = ${id} RETURNING "like", "dislike"`);
        return data.rows;
    },
    removeRating: async (id, rating) => {
        const data = await db.query(`UPDATE reviews SET "${rating}" = "${rating}" - 1 WHERE id = ${id} RETURNING "like", "dislike"`);
        return data.rows;
    },
    getGameReviews: async (id) => {
        const data = await db.query(`SELECT reviews.id, reviews.game_id, reviews.email, reviews.score, reviews.summary, reviews.like, reviews.date_added, users.username FROM reviews INNER JOIN users ON reviews.email = users.email WHERE reviews.game_id = $1 ORDER BY reviews.date_added DESC LIMIT 4`, [id]);
        return data.rows;
    },
    getAllGameReviews: async (id, offset) => {
        const data = await db.query(`SELECT reviews.id, reviews.game_id, reviews.email, reviews.score, reviews.summary, reviews.like, reviews.date_added, users.username FROM reviews INNER JOIN users ON reviews.email = users.email WHERE reviews.game_id = $1 ORDER BY reviews.date_added DESC LIMIT 25 OFFSET ${offset}`, [id]);
        return data.rows;
    }

}

export default reviewService