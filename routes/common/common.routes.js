import { Router } from "express";
 import { getBanner } from "../../controllers/bannerController/banner.controller.js"

const commonRouter = Router();


commonRouter.get("/get-banner", getBanner)

  

export default commonRouter