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
    getEvents: async (req, res) => {

        config.url = baseURL + '/events';
        config.data = `fields name, event_logo.url, start_time; sort start_time desc; limit 2;`;

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

