import reviewService from "../services/reviewService.js";
import gameService from "../services/gameService.js";
import preferenceService from "../services/preferenceService.js";

const reviewController = {
    getReviews: async (req, res) => {

        var reviews = await reviewService.getReviews(req.body.offset);

        let gameIDs = [];

        Object.values(reviews).forEach((item) => {

            gameIDs = [...gameIDs, item.game_id];

        })

        const gameInfo = await gameService.gamesInfo(gameIDs);

        const result = reviews.map((review) => {

            let [game] = gameInfo.filter((item) => {
                return item.id == review.game_id
            })

            Object.values({ game }).forEach((item) => {

                if (item.artworks) {
                    item.artworks[0].url = item.artworks[0].url.replace(/t_thumb/, "t_screenshot_med");
                }
                if (item.screenshots) {
                    item.screenshots[0].url = item.screenshots[0].url.replace(/t_thumb/, "t_screenshot_med");
                }

            })

            return { ...review, game_name: game.name, game_artworks: game.artworks, game_screenshots: game.screenshots }

        })

        res.status(200).send(result);

    },
    getReview: async (req, res) => {
        const { id, email } = req.body

        let review = "";
        let preference = "";
        if (!isNaN(id)) {
            [review] = await reviewService.getReview(id);
            [preference] = await preferenceService.getReviewLiked(id, email);
        }

        let game = "";
        if (review) {
            [game] = await gameService.gamesInfo(review.game_id);
        }

        if (game) {
            if (game.artworks) {
                game.artworks[0].url = game.artworks[0].url.replace(/t_thumb/, "t_1080p");
            }
            if (game.screenshots) {
                game.screenshots[0].url = game.screenshots[0].url.replace(/t_thumb/, "t_1080p");
            }
        }

        let liked = null;
        let prefID = null;
        if (preference) {
            liked = preference.liked;
            prefID = preference.id;
        }

        const result = { ...review, game_name: game.name, game_artworks: game.artworks, game_screenshots: game.screenshots, liked: liked, prefID: prefID }

        res.status(200).send(result);
    },
    setReview: async (req, res) => {
        const { id, gameID, email, score, summary, review } = req.body.formData;

        let result = "";
        if (id) {
            [result] = await reviewService.editReview(id, score, summary, review);
        } else {
            [result] = await reviewService.addReview(gameID, email, score, summary, review);
        }

        res.status(200).send(result);
    },
    getReviewData: async (req, res) => {
        const { email, id } = req.body

        const [review] = await reviewService.getReviewData(id, email);

        res.status(200).send(review);
    },
    deleteReview: async (req, res) => {
        const id = req.body.id

        await reviewService.deleteReview(id);

        res.status(200).send(true);
    }

}

export default reviewController;