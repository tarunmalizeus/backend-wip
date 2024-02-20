const express = require('express');
const router = express.Router();
const sequelize = require('../database'); // Import the sequelize instance
const { QueryTypes } = require('sequelize');


// const [result, metadata] = await sequelize.query(`SELECT * FROM Users WHERE email="${email}"`,{ type: QueryTypes.SELECT });


router.get("/", async (req, res) => {
    const [result, metadata] = await sequelize.query(`SELECT * from job;`);
    console.log(result);
    // const listOfPosts = await Posts.findAll({include:[Likes]});
    // res.json(listOfPosts);
    res.json(result);
  });

  module.exports = router;