const express = require('express');
const router = express.Router();

const {signUp} = require('../controllers/Auth');

router.post("/signup", signUp);

router.post("/login", async (req, res) => {
    res.json({
        message: "login route accessible"
    });
})

module.exports = router;