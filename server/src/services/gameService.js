import axios from "axios";
import env from "dotenv";
import { getTwitchToken } from '../config/igdb.js';
import { ALLOWED_SORTS } from "../constants/igdbFilters.js";
import db from "../config/database.js"

const token = await getTwitchToken();
env.config();

let baseURL = 'https://api.igdb.com/v4';

let config = {
    method: 'post',
    url: '',
    headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
    },
    data: ''
};

let millis = Date.now().toString().slice(0, 10);


const gameService = {
    homeAllGames: async () => {

        config.url = baseURL + '/multiquery';
        config.data = `
            query games "Hyped" {
                fields name, platforms, cover.url, slug, first_release_date, hypes; where first_release_date > ${millis} & game_type = (0, 8, 9, 10, 11); sort hypes desc; limit 6;
            };

            query games "New" {
                fields name, platforms, cover.url, slug, first_release_date; where first_release_date < ${millis} & game_type = (0, 8, 9, 10, 11); sort first_release_date desc; limit 6;
            };

            query games "Upcoming" {
                fields name, platforms, cover.url, slug, first_release_date; where first_release_date > ${millis} & game_type = (0, 8, 9, 10, 11); sort first_release_date asc; limit 6;
            };

            query games "Best" {
                fields name, platforms, cover.url, slug, genres.name, rating, rating_count, first_release_date; where rating_count > 100 & game_type = (0, 8, 9, 10, 11); sort rating desc; limit 10;
            };
        `;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    gameInfo: async (id) => {

        config.url = baseURL + '/games';
        config.data = `fields name, genres.name, first_release_date, artworks.url, screenshots.url; where id = ${id};`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    gamesInfo: async (ids) => {

        config.url = baseURL + '/games';
        config.data = `fields name, artworks.url, screenshots.url; where id = (${ids});`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    game: async (slug) => {

        config.url = baseURL + '/games';
        config.data = `fields *, cover.url, artworks.*, screenshots.*, videos.video_id, platforms.name, genres.name, themes.name, game_modes.name, player_perspectives.name, involved_companies.*, involved_companies.company.name, game_engines.name, alternative_names.*, language_supports.language.name, language_supports.language_support_type; where slug = "${slug}";`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getSimilarGames: async (ids) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, slug; where id = (${ids}) & game_type = (0, 8, 9, 10, 11); limit 10;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getGameGenres: async (ids) => {

        config.url = baseURL + '/games';
        config.data = `fields genres.name; where id = (${ids}); limit 500;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getFavoriteGames: async (ids) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, slug; where id = (${ids}); limit 6;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getGameInfoActivities: async (ids) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, slug; where id = (${ids});`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    searchGames: async (query) => {

        config.url = baseURL + '/games';
        config.data = `search "${query}"; fields name, cover.url, slug, platforms.abbreviation, first_release_date; where game_type = (0, 8, 9, 10, 11); limit 5;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getGames: async (filters) => {

        const {
            sanitizedQuery = '',
            platforms = '',
            genres = '',
            gameModes = '',
            themes = '',
            perspective = '',
            startYear = '',
            endYear = '',
            sort = '',
            offset = 0
        } = filters;
        
        const whereClauses = [
            'game_type = (0, 8, 9, 10, 11)', // Exclude non-game releases
        ];

        const addWhere = (clause) => {
            if (!whereClauses.includes(clause)) {
                whereClauses.push(clause);
            }
        };

        const sanitizeIDs = (raw) => raw.split(',').map(Number).filter(Boolean).join(',');
       
        if (platforms) addWhere(`platforms = (${sanitizeIDs(platforms)})`);
        if (genres) addWhere(`genres = (${sanitizeIDs(genres)})`);
        if (gameModes) addWhere(`game_modes = (${sanitizeIDs(gameModes)})`);
        if (themes) addWhere(`themes = (${sanitizeIDs(themes)})`);
        if (perspective) addWhere(`player_perspectives = (${sanitizeIDs(perspective)})`);

        if (startYear || endYear) {
            addWhere('first_release_date != null');

            if (startYear && !isNaN(startYear)) {
                const startTimestamp = Math.floor(new Date(`${startYear}-01-01T00:00:00Z`).getTime() / 1000);
                addWhere(`first_release_date >= ${startTimestamp}`);
            }

            if (endYear && !isNaN(endYear)) {
                const endTimestamp = Math.floor(new Date(`${endYear}-12-31T23:59:59Z`).getTime() / 1000);
                addWhere(`first_release_date <= ${endTimestamp}`);
            }
        }

        let sortDirective = '';
        

        if (sanitizedQuery) {
            // Search directive overrides manual sorting
            if(sort === 'relevance'){
                sortDirective = `search "${sanitizedQuery}";`;
            } else {
                addWhere(`name ~ *"${sanitizedQuery}"*`);
            }
            
        } 
        
        if (sort != 'relevance') {       
            const validSort = ALLOWED_SORTS.has(sort) ? sort : 'popularity_desc';
            const [field, direction] = validSort.split('_'); // e.g., ['rating', 'asc']
            const order = direction === 'asc' ? 'asc' : 'desc';

            switch (field) {
                case 'release': // Handles 'release_asc' or 'release_desc'
                    addWhere('first_release_date != null');
                    addWhere(`first_release_date < ${millis}`);
                    sortDirective = `sort first_release_date ${order};`;
                    break;

                case 'upcoming':
                    addWhere('first_release_date != null');
                    addWhere(`first_release_date > ${millis}`);
                    sortDirective = `sort first_release_date ${order};`;
                    break;

                case 'name':
                    sortDirective = `sort name ${order};`;
                    break;

                case 'rating':
                    addWhere('rating != null');
                    addWhere('rating_count >= 100');
                    sortDirective = `sort rating ${order};`;
                    break;

                case 'anticipated':
                    addWhere('first_release_date != null');
                    addWhere(`first_release_date > ${millis}`);
                    sortDirective = `sort hypes ${order};`;
                    break;

                case 'popularity':
                default:
                    addWhere('rating_count != null');
                    sortDirective = `sort rating_count ${order};`;
                    break;
            }
        }

        config.url = baseURL + '/games';
        config.data =
            `fields name, slug, cover.url;
            where ${whereClauses.join(' & ')};
            ${sortDirective}
            limit 25;
            offset ${offset};
        `;
        
        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getGameFilters: async () => {

        const [genreResults, themeResults, platformResutls] = await Promise.all([
            db.query(`SELECT id, name FROM igdb_genres`),
            db.query(`SELECT id, name FROM igdb_themes`),
            db.query(`SELECT id, name,
                CASE 
                    WHEN id IN (167, 6, 130, 169, 48, 49, 39, 34) THEN 1
                    ELSE 2
                END AS priority
                FROM igdb_platforms
                ORDER BY priority ASC, name ASC;`),
            ]);
        return {
            genres: genreResults.rows,
            themes: themeResults.rows,
            platforms: platformResutls.rows
        };

    },


}


export default gameService;

