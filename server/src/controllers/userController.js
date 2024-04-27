import userService from "../services/userService.js";

const userController = {
    getUsers: async (req, res) => {
        var users = await userService.users();

        res.status(200).send(users);
    }



}

export default userController;

