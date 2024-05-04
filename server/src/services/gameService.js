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
    hypedGames: async (req, res) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, first_release_date, hypes; where first_release_date > ${millis}; sort hypes desc; limit 6;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    newGames: async (req, res) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, first_release_date; where first_release_date < ${millis}; sort first_release_date desc; limit 6;`;


        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    upcomingGames: async (req, res) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, first_release_date; where first_release_date > ${millis}; sort first_release_date asc; limit 6;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    bestGames: async (req, res) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, genres.name, rating, rating_count, category, first_release_date; where rating_count > 200 & category = (0, 3, 8, 9, 10); sort rating desc; limit 10;`;

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

