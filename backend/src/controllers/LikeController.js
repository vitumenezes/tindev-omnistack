const Dev = require("../models/Dev");

module.exports = {

  /*
   * Method to store a new like
   */
  async store(req, res) {
    const  { user } =  req.headers;
    const  { devId } =  req.params;
  
    const loggedDev = await Dev.findById(user); //user logged
    const targetDev = await Dev.findById(devId); //user to be liked

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists"});
    }

    // Checks the possible match
    if (targetDev.likes.includes(loggedDev._id)) {
      console.log("DEU MATCH!");
    }
    
    loggedDev.likes.push(targetDev._id);

    // OBS: always necessary use the save method
    await loggedDev.save();
    
    return res.json(loggedDev);
  }
}