import db from "../config/database.js"

const followService = {
    getFollowData: async (id, userID) => {
        const data = await db.query(`SELECT * FROM follows WHERE following_id = $1 AND follower_id = $2`, [id, userID]);
        return data.rows;

    },
    getFollowerCount: async (id) => {
        const data = await db.query(`SELECT count(id) FROM follows WHERE following_id = $1`, [id]);
        return data.rows;

    },
    getFollowingCount: async (id) => {
        const data = await db.query(`SELECT count(id) FROM follows WHERE follower_id = $1`, [id]);
        return data.rows;

    },
    followUser: async (id, userID) => {
        const data = await db.query(`INSERT INTO follows (follower_id, following_id, date_added) VALUES ($2, $1, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`, [id, userID]);
        return data.rows;

    },
    unfollowUser: async (id) => {
        const data = await db.query(`DELETE FROM follows WHERE id = $1`, [id]);
        return data.rows;

    },
    getFollowers: async (id, offset) => {
        const data = await db.query(`SELECT follows.id, follows.follower_id, follows.following_id, follows.date_added, users.username, users.id AS user_id, users.profile_picture FROM follows INNER JOIN users ON follows.follower_id = users.id WHERE following_id = $1 ORDER BY follows.date_added DESC LIMIT 31 OFFSET $2`, [id, offset]);
        return data.rows;
    },
    getFollowing: async (id, offset) => {
        const data = await db.query(`SELECT follows.id, follows.follower_id, follows.following_id, follows.date_added, users.username, users.id AS user_id, users.profile_picture FROM follows INNER JOIN users ON follows.following_id = users.id WHERE follower_id = $1 ORDER BY follows.date_added DESC LIMIT 31 OFFSET $2`, [id, offset]);
        return data.rows;
    }



}

export default followService;