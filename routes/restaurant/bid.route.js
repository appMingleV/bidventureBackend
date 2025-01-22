import {Router} from 'express';
import bidRestaurantController from '../../controllers/restaurantsController/bidRestaurant.controller.js';

const route=Router();

route.get('/single/:bidId',bidRestaurantController.getBidById)


export default route