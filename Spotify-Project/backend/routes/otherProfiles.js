const express = require('express');
const router = express.Router();
const { getOtherUserProfile } = require('../utils/firebase-util');

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log("user id: " + userId);

    try{
        const profile = await getOtherUserProfile(userId);
        res.status(200).json(profile);

    }
    catch(e){
        console.error("error fetching this user's profile: " + e);
        res.status(404).json("error fetching this user's profile: " + e);
    };
});

module.exports = router;