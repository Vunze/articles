const express = require('express')
const router = express.Router()

const {getAllArticles, findArticle, findByConference} = require("../controllers/articles.controller")

router.get('/', getAllArticles);
router.get("/:id", findArticle);
router.get("/conf", findByConference);


module.exports = router;