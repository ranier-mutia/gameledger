import gameService from "../services/gameService.js";

const gameController = {
    getAllGames: async (req, res) => {

        var games = {
            hyped: [],
            new: [],
            upcoming: [],
            best: []
        };

        games.hyped = await gameService.hypedGames();
        games.new = await gameService.newGames();
        games.upcoming = await gameService.upcomingGames();
        games.best = await gameService.bestGames();

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
    }

}

export default gameController;

