const express = require("express");
const router = express.Router();
const User = require("../models/User");

const Offer = require("../models/Offer");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const cloudinary = require("cloudinary").v2;

// fonction de formatage pour cloudinary :
const convertToBase64 = (file) => {
  console.log(file);
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
  //console.log(convertToBase64(req.files.picture));
  //console.log(req.user);
};

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    //   // l'appel de la fonction "fileUpload" return la fonction isAnthenticated
    //console.log(req.body);
    //console.log(req.files);
    try {
      const {
        title,
        description,
        price,
        condition,
        city,
        brand,
        size,
        color,
        //picture,
      } = req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        //product_image: Object,
        owner: req.user._id,
      });

      const result = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture)
      );
      //console.log(result);
      newOffer.product_image = result;
      //res.json("OK");

      await newOffer.save(); // on sauvegarde la nouvelle offre dans la base de données

      const responseObj = {
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        product_image: result,
        owner: {
          account: req.user.account,
          _id: req.user._id,
        },
      };
      console.log(responseObj);

      return res.status(201).json(responseObj);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const regexp = new RegExp("t-shirt");
    const offers = await Offer.find({ product_name: regexp }).select(
      "product_name product_price -_id"
    ); // pour retirer une clé on enlève avec "-" devant la clé _id"
    // .sort({ product_name: "asc" })
    // .limit(5)
    // .skip(3)
    // .select("product_name product_price -_id");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// fonction de formatage pour cloudinary :
// const convertToBase64 = (file) => {
//   return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
// };

// router.post("/upload", isAuthenticated, fileUpload(), async (req, res) => {
//   try {
//     //console.log(req.body);
//     //console.log(req.files);
//     console.log(convertToBase64(req.files.picture));
//     console.log(req.user);

//     const result = await cloudinary.uploader.upload(
//       convertToBase64(req.files.picture)
//     );
//     console.log(result);
//     res.json("OK");
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });
