const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  console.log("On rentre dans le middleware");
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    //console.log(token);
    // est-ce que le token correspond  un user en bdd ?
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isAuthenticated;
