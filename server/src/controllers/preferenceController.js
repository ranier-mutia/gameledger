import gameService from "../services/gameService.js";
import preferenceService from "../services/preferenceService.js";
import reviewService from "../services/reviewService.js";
import activityService from "../services/activityService.js";

const preferenceController = {
    getFavoriteData: async (req, res) => {
        const { email, id } = req.body;

        const [favoriteData] = await preferenceService.getFavoriteData(email, id)

        res.status(200).send(favoriteData);
    },
    setFavorite: async (req, res) => {
        const { id, email, gameID } = req.body;

        let result = "";

        if (!id) {
            [result] = await preferenceService.addFavoriteData(email, gameID);
        } else {
            [result] = await preferenceService.deleteFavoriteData(id);
        }

        res.status(200).send(result);
    },
    setReviewPreference: async (req, res) => {
        const { revID, prefID, email, liked, prevLiked } = req.body;

        let result = "";
        let rating = "";

        if (prevLiked != null) {

            if (prevLiked != liked) {

                let pref = { dec: "dislike", inc: "like" };
                if (prevLiked == true) {
                    pref = { dec: "like", inc: "dislike" };
                }

                [result] = await preferenceService.setReviewPreference(prefID, liked);
                [rating] = await reviewService.changeRating(revID, pref);
            }
            else {

                let pref = "dislike"
                if (liked) { pref = "like" }

                await preferenceService.removeReviewPreference(prefID);
                [rating] = await reviewService.removeRating(revID, pref);
            }

        } else {

            let pref = "dislike"
            if (liked) { pref = "like" }

            [result] = await preferenceService.addReviewPreference(revID, email, liked);
            [rating] = await reviewService.addRating(revID, pref);

        }

        const data = { ...result, like: rating.like, dislike: rating.dislike }

        res.status(200).send(data);

    },
    setActivityPreference: async (req, res) => {
        const { actID, prefID, email, liked } = req.body;

        let result = "";
        let rating = "";

        if (liked) {

            await preferenceService.removeActivityPreference(prefID);
            [rating] = await activityService.removeRating(actID);


        } else {

            [result] = await preferenceService.addActivityPreference(actID, email);
            [rating] = await activityService.addRating(actID);

        }

        const data = { ...result, likes: rating.likes }

        res.status(200).send(data);

    },
    getFavoriteGames: async (req, res) => {
        const email = req.body.email;

        let ids = "";

        if (email) {
            ids = await preferenceService.getFavoriteGames(email);
        }

        let gameIDs = [];

        if (ids) {
            Object.values(ids).forEach((item) => {

                gameIDs = [...gameIDs, item.target_id];

            })
        }

        let games = ""
        if (gameIDs) {
            games = await gameService.getFavoriteGames(gameIDs);
        }

        if (games) {
            Object.values(games).forEach((item) => {

                if (item.cover) {
                    item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
                }

            })
        }


        res.status(200).send(games);
    },
    getAllFavoriteGames: async (req, res) => {
        const { email, offset } = req.body;

        let ids = "";

        if (email) {
            ids = await preferenceService.getAllFavoriteGames(email, offset);
        }

        let gameIDs = [];

        if (ids) {
            Object.values(ids).forEach((item) => {

                gameIDs = [...gameIDs, item.target_id];

            })
        }

        let games = ""
        if (gameIDs) {
            games = await gameService.getFavoriteGames(gameIDs);
        }

        if (games) {
            Object.values(games).forEach((item) => {

                if (item.cover) {
                    item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
                }

            })
        }


        res.status(200).send(games);
    },
}

export default preferenceController;