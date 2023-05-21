const express = require("express")
const mongoose = require("mongoose")

const articlePost = require("../models/article")

const getAllArticles = async (req, res) => {
    try {
        const articles = await articlePost.find().sort();
        res.status(200).json(articles)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

const findByConference = async (req, res) => {
    try {
        confs = req.body['body']['confs'];
        const found = await articlePost.find({conference : confs})
        res.status(200).json(found)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
}

const findByLink = async(req, res) => {
    try {
        link = req.body['body']['link']
        const found = await articlePost.find({id: link})
        res.status(200).json(found)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
}

const findArticle = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`article ${id} not found`);

    const found = await articlePost.findById(id);

    res.json(found);
};

module.exports = {getAllArticles, findArticle, findByConference, findByLink}