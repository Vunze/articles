const mongoose = require("mongoose")

const articleSchema = mongoose.Schema({
    id: String,
    published: Date,
    title: String,
    comment: String,
    conference: String,
    author: String,
})

const articlePost = mongoose.model("Article", articleSchema)

module.exports = articlePost;