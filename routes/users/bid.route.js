import {Router} from 'express';
import bidRestaurantController from '../../controllers/restaurantsController/bidRestaurant.controller.js';
import multer from 'multer';
import userAuthController from '../../controllers/userController/userAuth.controller.js';
const routes = Router();


routes.get('/all/:userId',userAuthController.getAllBids)
.get('/single/:bidId',bidRestaurantController.getBidById)


export default routes;