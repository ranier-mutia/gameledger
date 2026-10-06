import listService from "../services/listService.js";
import gameService from "../services/gameService.js";
import userService from "../services/userService.js";
import activityService from "../services/activityService.js";

const listController = {
    getListData: async (req, res) => {
        const { email, id } = req.body;

        const [listData] = await listService.getListData(email, id)

        res.status(200).send(listData);
    },
    updateListData: async (req, res) => {
        const { id, gameID, email, status, score, dateStart, dateEnd } = req.body;

        if (!id) {
            const [list] = await listService.addListData(gameID, email, status, score, dateStart, dateEnd);
            await activityService.addUserActivity(gameID, email, status, list.id);

        } else {
            await listService.updateListData(id, status, score, dateStart, dateEnd);
            const [activity] = await activityService.getUserActivity(id);

            if (activity.status != status) {
                await activityService.addUserActivity(gameID, email, status, id);
            }

        }

        let topGenres = "";
        let ids = "";

        if (email) {
            ids = await listService.getGameIDs(email);
        }

        let gameIDs = [];

        Object.values(ids).forEach((item) => {

            gameIDs = [...gameIDs, item.game_id];

        })

        let genres = "";
        if (gameIDs.length) {
            genres = await gameService.getGameGenres(gameIDs);
        }

        if (genres) {
            const flatten = array =>
                array.reduce((results, item) => item.genres ? [...results, ...item.genres.map(genre => ({ name: genre.name }))] : [...results], []);

            const flattened = flatten(genres);

            const mergeAndCount = flattened.reduce((a, c) => {
                const obj = a.find((obj) => obj.name === c.name);
                if (!obj) {
                    a.push({ name: c.name, count: 1 });
                }
                else {
                    obj.count += 1;
                }
                return a;
            }, []);

            const sorted = mergeAndCount.sort((a, b) =>
                b.count - a.count
            )

            topGenres = sorted.slice(0, 5);
        }

        await userService.setTopGenres(email, JSON.stringify(topGenres));

        res.status(200).send(true);

    },
    deleteListData: async (req, res) => {
        const { id } = req.body;

        await listService.deleteListData(id);
        await activityService.deleteUserActivities(id);

        res.status(200).send(true);
    },
    setStatus: async (req, res) => {
        const { id, gameID, email, status } = req.body;

        let result = "";

        if (!id) {
            [result] = await listService.setStatus(gameID, email, status);
            await activityService.addUserActivity(gameID, email, status, result.id);
        } else {
            [result] = await listService.updateStatus(id, status);
            const [activity] = await activityService.getUserActivity(id);

            if (activity.status != status) {
                await activityService.addUserActivity(gameID, email, status, id);
            }
        }

        res.status(200).send(result);
    },
    getStatusCount: async (req, res) => {

        const id = req.body.id;

        let result = "";

        if (id) {
            [result] = await listService.getStatusCount(id);
        }
        res.status(200).send(result);
    },
    getGameCount: async (req, res) => {

        const email = req.body.email;

        let result = "";

        if (email) {
            [result] = await listService.getGameCount(email);
        }

        res.status(200).send(result);
    },
    getGameGenres: async (req, res) => {

        const email = req.body.email;
        const [result] = await userService.getTopGenres(email);
        res.status(200).send(result.top_genres);

    },
    getAllUserLists: async (req, res) => {

        const { email, filter, offset } = req.body;

        let lists = "";
        if (email) {
            lists = await listService.getAllUserLists(email, filter, offset);
        }

        let gameIDs = [];
        Object.values(lists).forEach((item) => {
            gameIDs = [...gameIDs, item.game_id];
        })

        let gameInfo;
        if (gameIDs.length) {
            gameInfo = await gameService.getGameInfoActivities(gameIDs);
        }

        let result;
        if (gameInfo) {
            result = lists.map((list) => {

                let [game] = gameInfo.filter((item) => {
                    return item.id == list.game_id
                })


                return { ...list, game_name: game && game.name, game_cover: game && game.cover.url, game_slug: game && game.slug }

            })
        }

        res.status(200).send(result);
    },
    getGameScore: async (req, res) => {

        const id = req.body.id;

        let result = "";

        if (!isNaN(id)) {
            [result] = await listService.getGameScore(id);
        }

        res.status(200).send(result.avg_score);
    },


}

export default listController;