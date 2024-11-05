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

const eventService = {
    getEvents: async (offset) => {

        config.url = baseURL + '/events';
        config.data = `fields name, event_logo.url, start_time, end_time, slug; where start_time != null; sort start_time desc; offset ${offset}; limit 17;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getEvent: async (slug) => {

        config.url = baseURL + '/events';
        config.data = `fields *, event_logo.url, videos.video_id; where slug = "${slug}";`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getShowCasedGames: async (ids) => {

        config.url = baseURL + '/games';
        config.data = `fields name, cover.url, slug; where id = (${ids}); limit 100;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    }

}


export default eventService;

