import preferenceService from "../services/preferenceService.js";
import reviewService from "../services/reviewService.js";

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

    }
}

export default preferenceController;