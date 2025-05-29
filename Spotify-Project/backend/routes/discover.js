const express = require("express");
const router = express.Router();
const { getPublicProfiles } = require("../utils/firebase-util");

router.get('/', async(req, res) => {
    try{
        const profiles = await getPublicProfiles(20);
        console.log("Profiles: " + profiles)
        const simplifiedProfiles = profiles.map((user) => ({
            id: user.id,
            profileName: user.profileName || 'Unnamed User',
            image: user.image || '',
            bio: user.bio || ''       

        }));
        res.json(simplifiedProfiles);
    }
    catch(e){
        console.error("An error occurred trying to retrieve profiles:" + e);
        res.status(500).json({ e: "Failed to receive public profiles"});
    };
});

// router.get('/', (req, res) => {
//   res.json([{ profileName: 'Obama' },
//             { profileName: 'Michelle'},
//             { profileName: 'spotify-user-54982933'},
//             { profileName: 'michaeljacksonrules82'},
//             { profileName: 'GrannySmithHerself'},
//             { profileName: 'test-account6000'},
//             { profileName: 'walterwhite1964'}
//   ])
// });

module.exports = router;