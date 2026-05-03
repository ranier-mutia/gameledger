import activityService from "../services/activityService.js";
import gameService from "../services/gameService.js";
import preferenceService from "../services/preferenceService.js";


const activityController = {
    getUserActivities: async (req, res) => {
        const { email, userEmail } = req.body;

        const activities = await activityService.getUserActivities(email)

        let gameIDs = [];
        let ids = [];
        Object.values(activities).forEach((item) => {

            gameIDs = [...gameIDs, item.game_id];
            ids = [...ids, item.id];

        })

        let preferences;
        if (ids.length) {
            preferences = await preferenceService.getActivityPreferences(ids, userEmail);
        }

        let gameInfo;
        if (gameIDs.length) {
            gameInfo = await gameService.getGameInfoActivities(gameIDs);
        }

        let result;
        if (gameInfo) {
            result = activities.map((activity) => {

                let [game] = gameInfo.filter((item) => {
                    return item.id == activity.game_id
                })

                let [preference] = preferences.filter((item) => {
                    return item.target_id == activity.id
                })

                let liked = null;
                let prefID = null;
                if (preference) {
                    liked = true;
                    prefID = preference.id;
                }

                return { ...activity, game_name: game.name, game_cover: game.cover.url, game_slug: game.slug, liked: liked, prefID: prefID }

            })
        }


        res.status(200).send(result);
    },
    getAllUserActivities: async (req, res) => {
        const { email, userEmail, filter, offset } = req.body;

        let activities;
        if (filter == "all") {
            activities = await activityService.getAllUserActivities(email, offset)
        } else {
            activities = await activityService.getAllUserActivitiesFilter(email, filter, offset)
        }

        let gameIDs = [];
        let ids = [];
        Object.values(activities).forEach((item) => {

            gameIDs = [...gameIDs, item.game_id];
            ids = [...ids, item.id];

        })

        let preferences;
        if (ids.length) {
            preferences = await preferenceService.getActivityPreferences(ids, userEmail);
        }

        let gameInfo;
        if (gameIDs.length) {
            gameInfo = await gameService.getGameInfoActivities(gameIDs);
        }

        let result;
        if (gameInfo) {
            result = activities.map((activity) => {

                let [game] = gameInfo.filter((item) => {
                    return item.id == activity.game_id
                })

                let [preference] = preferences.filter((item) => {
                    return item.target_id == activity.id
                })

                let liked = null;
                let prefID = null;
                if (preference) {
                    liked = true;
                    prefID = preference.id;
                }

                return { ...activity, game_name: game.name, game_cover: game.cover.url, game_slug: game.slug, liked: liked, prefID: prefID }

            })
        }


        res.status(200).send(result);
    }


}

export default activityController;