import eventService from "../services/eventService.js";

const eventController = {
    getEvents: async (req, res) => {

        var events = await eventService.getEvents();



        Object.values(events).forEach((item) => {

            if (item.event_logo) {
                const imgURL = item.event_logo.url;
                let result = imgURL.replace(/t_thumb/, "t_720p");
                item.event_logo.url = result;
            }

        })



        res.status(200).send(events);
    }

}

export default eventController;

