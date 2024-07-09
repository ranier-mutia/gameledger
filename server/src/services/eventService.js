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

const eventService = {
    getOngoingEvents: async () => {

        config.url = baseURL + '/events';
        config.data = `fields name, event_logo.url, start_time, end_time, slug; where start_time < ${millis} & end_time > ${millis}; sort start_time desc; limit 24;`;

        return axios.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Failed to make request:", error.message);
            })

    },
    getPastEvents: async (offset) => {

        config.url = baseURL + '/events';
        config.data = `fields name, event_logo.url, start_time, end_time, slug; where start_time != null; sort start_time desc; offset ${offset}; limit 12;`;

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

