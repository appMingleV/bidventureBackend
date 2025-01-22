import {Router} from 'express';
import bidRestaurantController from '../../controllers/restaurantsController/bidRestaurant.controller.js';
import multer from 'multer';
const routes = Router();


routes.get('/all/:userId',bidRestaurantController.getAllBids)
.get('/single/:bidId',bidRestaurantController.getBidById)


export default routes;