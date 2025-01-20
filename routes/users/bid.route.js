import {Router} from 'express';
import bidRestaurantController from '../../controllers/restaurantsController/bidRestaurant.controller.js';
const routes = Router();


routes.get('/all/:userId',bidRestaurantController.getAllBids)
.get('/single/:bidId',bidRestaurantController.getBidById)


export default routes;