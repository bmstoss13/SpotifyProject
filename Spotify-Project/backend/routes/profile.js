const express = require("express");
const router = express.Router();

router.get('/:userId', async (req, res) => {
	// const {userId} = req.params;
	// const docRef = doc(db, "users", userId);
    // const docSnap = await getDoc(docRef);

    // if (!docSnap.exists) {
    //   return res.status(404).json({ error: "Profile not found" });
    // }
	// res.json(docSnap.data());
  res.json({ name: 'Obama', bio: 'I love coding.' });
});

module.exports = router;