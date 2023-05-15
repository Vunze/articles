const mongoose = require("mongoose")

const articleSchema = mongoose.Schema({
    id: Object,
    summary: String,
    published: Date,
    title: String,
    comment: String,
    conference: String,
    authors: [String],
    links: [String],
});

const articlePost = mongoose.model("Article", articleSchema);

module.exports = articlePost;