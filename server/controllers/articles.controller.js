//controllers/blogPosts.controller.js
const express = require("express")
const mongoose = require("mongoose")

const articlePost = require("../models/article")

const getAllArticles = async (req, res) => {
    try {
        const articles = await articlePost.find();
        res.status(200).json(articles)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

const findByConference = async (req, res) => {
    try {
        conf = req.body;
        const found = await articlePost.find({conference : conf})
        res.status(200).json(found)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
}


const updateSingleArticle = async (req, res) => {
    const { id } = req.params;
    const { link, published, title, comment, conference } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`post ${id} not found`);

    const updatedArticle = {
        link,
        published,
        title,
        comment,
        conference,
        _id: id,
    };
    await articlePost.findByIdAndUpdate(id, updatedArticle, { new: true });
    res.json(updatedArticle);
};

const removeSingleArticle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`post ${id} not found`);

    await articlePost.findByIdAndRemove(id);

    res.json({ message: "Successfully deleted" });
};

module.exports = {getAllArticles, updateSingleArticle, removeSingleArticle, findByConference}