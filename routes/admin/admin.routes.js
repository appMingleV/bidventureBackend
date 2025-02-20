import { Router } from "express";
import {
  adminRegister,
  adminLogin,
  getAllUsers,
  getAllRestaurants,
} from "../../controllers/adminController/loginController.js";
import restaurantAuthController from "../../controllers/restaurantsController/restaurantAuth.controller.js";
import { adminAuth } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/multerBanner.js";
import { uploadBanner,getBanner } from "../../controllers/bannerController/banner.controller.js";

const AdminRouter = Router();

AdminRouter.post("/adminRegister", adminRegister).post("/login", adminLogin);

const AdminProtectedRouter = Router();
AdminProtectedRouter.use(adminAuth);

AdminProtectedRouter.get("/users", getAllUsers)
  .get("/restaurants", getAllRestaurants)
  .get("/restaurants/profile", restaurantAuthController.getSingleRestaurant)
  .post("/upload-banner", upload.single("banner"), uploadBanner)
  .get("/get-banner", getBanner);
  

export { AdminRouter, AdminProtectedRouter };