import followService from "../services/followService.js";
import userService from "../services/gameService.js";

const followController = {
    getFollowData: async (req, res) => {
        const { id, userID } = req.body;

        let result;
        let followData;
        let followers;
        let following;
        if (!isNaN(id)) {
            if (userID) {
                [followData] = await followService.getFollowData(id, userID);
            }
            [followers] = await followService.getFollowerCount(id);
            [following] = await followService.getFollowingCount(id);
        }

        result = { ...followData, following: following && following.count, followers: followers && followers.count }


        res.status(200).send(result);
    },
    followUser: async (req, res) => {
        const { id, userID } = req.body;

        let result;
        let followData;
        let followers;
        let following;
        if (!isNaN(id)) {
            if (userID) {
                [followData] = await followService.followUser(id, userID);
            }
            [followers] = await followService.getFollowerCount(id);
            [following] = await followService.getFollowingCount(id);
        }

        result = { ...followData, following: following && following.count, followers: followers && followers.count }

        res.status(200).send(result);
    },
    unfollowUser: async (req, res) => {
        const { id, followID } = req.body;

        let result;
        let followers;
        let following;
        if (!isNaN(id)) {
            await followService.unfollowUser(followID);
            [followers] = await followService.getFollowerCount(id);
            [following] = await followService.getFollowingCount(id);
        }

        result = { following: following && following.count, followers: followers && followers.count }

        res.status(200).send(result);
    },
    getSocials: async (req, res) => {
        const { id, filter, offset } = req.body;

        let result;
        if (!isNaN(id)) {
            if (filter == "followers") {
                result = await followService.getFollowers(id, offset);
            } else {
                result = await followService.getFollowing(id, offset);
            }

        }

        res.status(200).send(result);
    },
}

export default followController;