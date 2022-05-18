const express = require("express");
const router = express.Router()
const urlController = require("../Controllers/urlController")

router.get("/test-me", function (req, res) {
    res.send("My server is running awesome!")
})

router.post("/url/shorten",urlController.createShortUrl)
router.get("/:urlCode",urlController.getorignalUrl)

module.exports = router