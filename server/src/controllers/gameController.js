import gameService from "../services/gameService.js";

const gameController = {
    getHomeGames: async (req, res) => {

        var platformIDs = JSON.parse(req.body.ids);

        if (!platformIDs.length) {
            platformIDs = [6, 167, 169, 48, 49, 130, 34, 39];

        }

        platformIDs = platformIDs.toString().replace("[", "").replace("]", "");

        var games = {
            hyped: [],
            new: [],
            upcoming: [],
            best: []
        };

        games.hyped = await gameService.hypedGames(platformIDs);
        games.new = await gameService.newGames(platformIDs);
        games.upcoming = await gameService.upcomingGames(platformIDs);
        games.best = await gameService.bestGames(platformIDs);

        Object.keys(games).forEach((category) => {

            Object.values(games[category]).forEach((item) => {

                if (item.cover) {
                    item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");

                    if (category == "best") {
                        let date = new Date(item.first_release_date * 1000);
                        item.release_date = date.getFullYear();

                        item.score = Math.round(item.rating);
                    }
                }

            })

        })

        res.status(200).send(games);
    },
    getHomePlatforms: async (req, res) => {

        var platforms = await gameService.platforms();
        res.status(200).send(platforms);

    },
    getAllGames: async (req, res) => {

        const offset = req.body.offset
        const type = req.body.type

        let games;
        switch (type) {
            case 'GAMES':
                games = await gameService.allDefaultGames(offset);
                break;
            case 'HYPED':
                games = await gameService.allHypedGames(offset);
                break;
            case 'NEW':
                games = await gameService.allNewGames(offset);
                break;
            case 'UPCOMING':
                games = await gameService.allUpcomingGames(offset);
                break;
            case 'BEST':
                games = await gameService.allBestGames(offset);
                break;
        }

        Object.values(games).forEach((item) => {

            if (item.cover) {
                item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
            }

        })

        res.status(200).send(games);

    },
    getGameInfo: async (req, res) => {

        const id = req.body.id;

        const gameInfo = await gameService.gameInfo(id);

        let date = new Date(gameInfo[0].first_release_date * 1000);
        gameInfo[0].release_date = date.getFullYear();

        if (gameInfo[0].artworks) {
            gameInfo[0].artwork = gameInfo[0].artworks[0].url.replace(/t_thumb/, "t_cover_big");
        }

        res.status(200).send(gameInfo);

    }

}

export default gameController;

