const express = require('express')
const router = express.Router()

const {getAllArticles, updateSingleArticle, removeSingleArticle} = require("../controllers/articles.controller")

router.get('/', getAllArticles);
router.patch("/:id", updateSingleArticle);
router.delete("/:id", removeSingleArticle);


module.exports = router