const fs = require("fs");
const mime = require("mime");
const path = require("path");

const uploadImage = async (req, res, next) => {
  const { image } = req.body;
  if (image == undefined || image == "") {
    req.fileName = undefined;
    next();
  } else {
    try {
      const codeExtension = image.charAt(0);
      let extensionn = "";

      if (codeExtension == "/") {
        extensionn = ".jpg";
      } else if (codeExtension == "i") {
        extensionn = ".png";
      } else {
        return res.json({
          success: false,
          message: "Must an Image jpg or png",
        });
      }

      let randomNumber = "";
      let characters = "0123456789";
      let charactersLength = characters.length;
      for (let i = 0; i < 6; i++) {
        randomNumber += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      let fileName = Date.now() + randomNumber + extensionn;

      const filePath = `public/images/${fileName}`;
      const buffer = Buffer.from(req.body.image, "base64");

      fs.writeFileSync(path.join(filePath), buffer);

      req.fileName = fileName;

      next();
    } catch (e) {
      return res.json({
        success: false,
        message: e.message,
      });
    }
  }
};

const uploadMultipleImage = async (req, res, next) => {
  const { image } = req.body;

  if (image == undefined || image == []) {
    req.fileName = undefined;
    next();
  } else {
    try {
      for (let i = 0; i < image.length; i++) {
        const item = image[i];
        const codeExtension = item.charAt(0);

        if (codeExtension == "/") {
          continue;
        } else if (codeExtension == "i") {
          continue;
        } else {
          return res.json({
            success: false,
            message: "Must an Image jpg or png",
          });
        }
      }

      const hasilfileName = [];

      for (let i = 0; i < image.length; i++) {
        const item = image[i];

        const codeExtension = item.charAt(0);
        let extensionn = "";

        if (codeExtension == "/") {
          extensionn = ".jpg";
        } else if (codeExtension == "i") {
          extensionn = ".png";
        } else {
          return res.json({
            success: false,
            message: "Must an Image jpg or png",
          });
        }

        let randomNumber = "";
        let characters = "0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
          randomNumber += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }

        let fileName = Date.now() + randomNumber + extensionn;

        const filePath = `public/images/${fileName}`;
        const buffer = Buffer.from(item, "base64");

        fs.writeFileSync(path.join(filePath), buffer);
        hasilfileName.push(fileName);
      }

      req.fileName = hasilfileName;

      next();
    } catch (e) {
      return res.json({
        success: false,
        message: e.message,
      });
    }
  }
};

module.exports = { uploadImage, uploadMultipleImage };
