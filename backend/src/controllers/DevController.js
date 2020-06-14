const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {

  /*
   * Method to list users who have not yet been marked with like or deslike
   */
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev =  await Dev.findById(user);

    // Find all elegible users
    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    })

    return res.json(users);
  },

  /*
   * Method to store a new user
   */
  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    // Check if user already exists
    if (userExists) {
      return res.json(userExists);
    }

    // Connects to the gihub API
    const response = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    }); 

    return res.json(dev);
  }
};