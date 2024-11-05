import listService from "../services/listService.js";

const listController = {
    getListData: async (req, res) => {
        const { email, id } = req.body;

        const [listData] = await listService.getListData(email, id)

        res.status(200).send(listData);
    },
    updateListData: async (req, res) => {
        const { id, gameID, email, status, score, dateStart, dateEnd } = req.body;

        if (!id) {
            await listService.addListData(gameID, email, status, score, dateStart, dateEnd);
        } else {
            await listService.updateListData(id, status, score, dateStart, dateEnd);
        }

        res.status(200).send(true);

    },
    deleteListData: async (req, res) => {
        const { id } = req.body;

        await listService.deleteListData(id);

        res.status(200).send(true);
    },
    setStatus: async (req, res) => {
        const { id, gameID, email, status } = req.body;

        let result = "";

        if (!id) {
            [result] = await listService.setStatus(gameID, email, status);
        } else {
            [result] = await listService.updateStatus(id, status);
        }

        res.status(200).send(result);
    },
    getStatusCount: async (req, res) => {

        const id = req.body.id;

        let result = "";

        if (id) {
            [result] = await listService.getStatusCount(id);
        }
        res.status(200).send(result);
    }


}

export default listController;