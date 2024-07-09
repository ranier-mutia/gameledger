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
        res.status(200).send(pastEvents);
    },
    getEvent: async (req, res) => {

        const slug = req.body.slug;

        var [event] = await eventService.getEvent(slug);

        if (event.start_time) {
            event.start_time = new Date(event.start_time * 1000).toLocaleString();
        }

        if (event.end_time) {
            event.end_time = new Date(event.end_time * 1000).toLocaleString();
        }

        if (event.event_logo) {
            const imgURL = event.event_logo.url;
            event.event_logo.url = imgURL.replace(/t_thumb/, "t_720p");
        }

        if (event.live_stream_url) {
            const vidURL = event.live_stream_url;
            event.live_stream_url = vidURL.replace("watch?v=", "embed/");
        }

        //console.log(event);
        res.status(200).send(event);

    },
    getShowCasedGames: async (req, res) => {

        const ids = req.body.gameIDs;

        const games = await eventService.getShowCasedGames(ids);

        Object.values(games).forEach((item) => {

            if (item.cover) {
                item.cover.urlBig = item.cover.url.replace(/t_thumb/, "t_cover_big");
            }

        })

        res.status(200).send(games);

    }

}

export default eventController;

