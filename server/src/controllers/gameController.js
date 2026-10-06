import gameService from "../services/gameService.js";
import { z } from "zod";

const searchInputSchema = z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .pipe(z.string().min(1).max(50));

const gameController = {
    getHomeAllGames: async (req, res) => {

        const [hyped, newG, upcoming, best] = await gameService.homeAllGames();

        let games = {};

        games.hyped = hyped.result;
        games.new = newG.result;
        games.upcoming = upcoming.result;
        games.best = best.result;

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
    getGameInfo: async (req, res) => {

        const id = req.body.id;

        const game = await gameService.gameInfo(id);

        let gameInfo = "";
        if (game) [gameInfo] = game;

        if (gameInfo) {
            let date = new Date(gameInfo.first_release_date * 1000);
            gameInfo.release_date = date.getFullYear();

            if (gameInfo.artworks) {
                gameInfo.artwork = gameInfo.artworks[0].url.replace(/t_thumb/, "t_screenshot_med");
            }

            if (gameInfo.screenshots) {
                gameInfo.screenshot = gameInfo.screenshots[0].url.replace(/t_thumb/, "t_screenshot_med");
            }
        }

        res.status(200).send(gameInfo);

    },
    getGame: async (req, res) => {

        const slug = req.body.slug;

        const [game] = await gameService.game(slug) ?? [];

        if (game) {
            if (game.first_release_date) {
                game.release_date = new Date(game.first_release_date * 1000).toLocaleDateString();
            }

            if (game.cover) {
                game.cover.urlBig = game.cover.url.replace(/t_thumb/, "t_cover_big");
            }

            if (game.artworks) {
                game.artwork = game.artworks[0].url.replace(/t_thumb/, "t_1080p");

                Object.values(game.artworks).forEach((item) => {

                    item.url = item.url.replace(/t_thumb/, "t_screenshot_huge");

                })
            }

            if (game.screenshots) {
                game.screenshot = game.screenshots[0].url.replace(/t_thumb/, "t_1080p");

                Object.values(game.screenshots).forEach((item) => {

                    item.url = item.url.replace(/t_thumb/, "t_screenshot_huge");

                })
            }
        }

        res.status(200).send(game);

    },
    getSimilarGames: async (req, res) => {

        const ids = req.body.gameIDs;

        const games = await gameService.getSimilarGames(ids);

        Object.values(games).forEach((item) => {

            if (item.cover) {
                item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
            }

        })

        res.status(200).send(games);

    },
    searchGames: async (req, res) => {

        const validation = searchInputSchema.safeParse(req.body.query);

        // If client bypassed frontend validation or sent bad types, return 400 Bad Request
        if (!validation.success) {
            return res.status(400).json({
                error: "Invalid request parameters"
            });
        }

        // Escape Postgres ILIKE wildcards (% and _)
        const sanitizedQuery = validation.data.replace(/[%_]/g, "\\$&");

        const games = await gameService.searchGames(sanitizedQuery);

        Object.values(games).forEach((item) => {

            let date = new Date(item.first_release_date * 1000);
            item.release_date = date.getFullYear();

            if (item.cover) {
                item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
            }

        })

        res.status(200).send(games);
    },
    getGames: async (req, res) => {
       
        try {
            const {
                search,
                platforms,
                genres,
                gameModes,
                themes,
                perspective,
                startYear,
                endYear,
                sort,
                offset
            } = req.body;
            
            let sanitizedQuery = "";
            if (search) {
                const validation = searchInputSchema.safeParse(search);
                // If client bypassed frontend validation or sent bad types, return 400 Bad Request
                if (!validation.success) {
                    return res.status(400).json({
                        error: "Invalid request parameters"
                    });
                }

                // Escape Postgres ILIKE wildcards (% and _)
                sanitizedQuery = validation.data.replace(/[%_]/g, "\\$&");
            }

            // Pass parsed query parameters directly to the service
            const result = await gameService.getGames({
                sanitizedQuery,
                platforms,
                genres,
                gameModes,
                themes,
                perspective,
                startYear,
                endYear,
                sort,
                offset
            });

            Object.values(result).forEach((item) => {
                if (item.cover) {
                    item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
                }
            })

            return res.json(result);

        } catch (error) {
            console.error('[GameController Error]:', error.message);
            return res.status(500).json({ error: 'Failed to retrieve games catalog.' });
        }
    },
    getGameFilters: async (req, res) => {

        const filters = await gameService.getGameFilters();
        res.status(200).send(filters);

    }

}

export default gameController;

