const express = require('express')
const router = express.Router()

const {getAllArticles, findArticle, findByConference, findByLink} = require("../controllers/articles.controller")

router.get('/', getAllArticles);
router.get("/:id", findArticle);
router.post("/conf", findByConference);
router.get("/link", findByLink);


module.exports = router;