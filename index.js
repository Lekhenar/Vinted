const express = require("express");

const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const cloudinary = require("cloudinary").v2;
// Connexion à cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

app.use(express.json());

// import de mes routeurs
const userRouter = require("./routes/user");
const offerRouter = require("./routes/offer");

// utilisation de mes routers
app.use("/user", userRouter); // le "/user" est un préfixe qui sera ajouté à toutes les routes de userRouter
app.use(offerRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "all route" });
});

app.listen(3000, () => {
  console.log("🔥 Server started 🔥");
});
