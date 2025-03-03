import Banner from "../../models/banner/banner.model.js";
import fs from "fs";

export const uploadBanner = async (req, res) => {
  try {
    // console.log(req.file);
    if (!req.file)
      return res
        .status(400)
        .json({ success, message: "Atleast one image is Required" });

    const imageurl = `${req.file.filename}`;
    console.log(imageurl);
    const image = await Banner.find();
    if (image.length === 0) {
      await Banner.create({ images: [imageurl] });
    } else {
      image[0].images.push(imageurl);
      await image[0].save();
    }
    return res.status(200).json({
      success: true,
      message: "images Uplaoded Successfully",
      banners: image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.stack,
    });
  }
};

export const getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    if (banners.length === 0 || banners[0].images.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Banner does not exist" });
    return res.status(200).json({
      banners,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteSingleImage = async (req, res) => {
  try {
    const { id, imageurl } = req.body;
    if (!id || !imageurl) {
      return res.status(400).json({
        success: false,
        message: "Id Or Imageurl is required",
      });
    }
    const image = await Banner.findbyId(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Banner Does not exist",
      });
    }
    // if()
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
