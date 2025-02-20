import Banner from "../../models/banner/banner.model.js";

export const uploadBanner = async (req, res) => {
  try {
    // console.log(req.file);
    if (!req.file)
      return res
        .status(401)
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
      message:"images Uplaoded Successfully"
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    if (!banners)
      return res
        .status(401)
        .json({ success: false, message: "Banner does not exist" });
    return res.status(200).json({
      banners,
      success: true,
    });
  } catch (error) {
    return res.status({
      success: false,
      error: error.message,
    });
  }
};
