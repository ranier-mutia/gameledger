import favoriteService from "../services/favoriteService.js";

const favoriteController = {
    getFavoriteData: async (req, res) => {
        const { email, id } = req.body;

        const [favoriteData] = await favoriteService.getFavoriteData(email, id)

        res.status(200).send(favoriteData);
    },
    setFavorite: async (req, res) => {
        const { id, email, gameID } = req.body;

        let result = "";

        if (!id) {
            [result] = await favoriteService.addFavoriteData(email, gameID);
        } else {
            [result] = await favoriteService.deleteFavoriteData(id);
        }

        res.status(200).send(result);
    }
}

export default favoriteController;