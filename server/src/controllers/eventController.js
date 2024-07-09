import eventService from "../services/eventService.js";

const eventController = {
    getOngoingEvents: async (req, res) => {

        var ongoingEvents = await eventService.getOngoingEvents();

        Object.values(ongoingEvents).forEach((item) => {

            if (item.event_logo) {
                const imgURL = item.event_logo.url;
                item.logo = imgURL.replace(/t_thumb/, "t_720p");
            }

        })

        res.status(200).send(ongoingEvents);
    },
    getPastEvents: async (req, res) => {

        var pastEvents = await eventService.getPastEvents(req.body.offset);

        Object.values(pastEvents).forEach((item) => {

            if (item.event_logo) {
                const imgURL = item.event_logo.url;
                item.logo = imgURL.replace(/t_thumb/, "t_720p");
            }

        })
        //console.log(pastEvents);
        res.status(200).send(pastEvents);
    }

}

export default eventController;

