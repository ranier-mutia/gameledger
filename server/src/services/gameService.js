import axios from "axios";
import env from "dotenv";

env.config();

let baseURL = 'https://api.igdb.com/v4';

let config = {
    method: 'post',
    url: '',
    headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${process.env.TWITCH_TOKEN}`,
    },
    data: ''
};

let millis = Date.now().toString().slice(0, 10);


const gameService = {
    homeAllGames: async (platformIDs) => {

        config.url = baseURL + '/multiquery';
        config.data = `
            query games "Hyped" {
                fields name, platforms, cover.url, slug, first_release_date, hypes; where first_release_date > ${millis} & platforms = (${platformIDs}); sort hypes desc; limit 6;
            };

            query games "New" {
                fields name, platforms, cover.url, slug, first_release_date; where first_release_date < ${millis} & platforms = (${platformIDs}); sort first_release_date desc; limit 6;
            };

            query games "Upcoming" {
                fields name, platforms, cover.url, slug, first_release_date; where first_release_date > ${millis} & platforms = (${platformIDs}); sort first_release_date asc; limit 6;
            };

            query games "Best" {
                fields name, platforms, cover.url, slug, genres.name, rating, rating_count, category, first_release_date; where rating_count > 200 & category = (0, 3, 8, 9, 10) & platforms = (${platformIDs}); sort rating desc; limit 10;
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
    allDefaultGames: async (offset) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, rating, slug; sort rating desc; offset ${offset}; limit 30;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    allHypedGames: async (offset) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, first_release_date, hypes, slug; where first_release_date > ${millis}; sort hypes desc; offset ${offset}; limit 30;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    allNewGames: async (offset) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, first_release_date, slug; where first_release_date < ${millis}; sort first_release_date desc; offset ${offset}; limit 30;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    allUpcomingGames: async (offset) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, first_release_date, slug; where first_release_date > ${millis}; sort first_release_date asc; offset ${offset}; limit 30;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    allBestGames: async (offset) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, category, rating, rating_count, slug; where rating_count > 200 & category = (0, 3, 8, 9, 10); sort rating desc; offset ${offset}; limit 30;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    homePlatforms: async () => {

        config.url = baseURL + '/platforms';
        config.data = `fields name, abbreviation; where id = (6,167,169,48,49,130,34,39) ; sort id desc; limit 20;`;

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
        config.data = `fields name, cover.url, slug; where id = (${ids}); limit 6;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    }


}


export default gameService;

