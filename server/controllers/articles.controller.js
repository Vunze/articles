const express = require("express")
const mongoose = require("mongoose")

const articlePost = require("../models/article")

const getAllArticles = async (req, res) => {
    try {
        const { sort_by, order } = req.query;
        if (order === "desc") {
            order = -1
        } else {
            order = 1
        }
        const articles = await articlePost.find().sort({sort_by: order});
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
    const { link, published, title, comment, conference, author } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`article ${id} not found`);

    const updatedArticle = {
        link,
        published,
        title,
        comment,
        conference,
        author,
        _id: id,
    };
    await articlePost.findByIdAndUpdate(id, updatedArticle, { new: true });
    res.json(updatedArticle);
};

const findArticle = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`article ${id} not found`);

    const found = await articlePost.findById(id);

    res.json(found);
};

module.exports = {getAllArticles, updateSingleArticle, findArticle, findByConference}