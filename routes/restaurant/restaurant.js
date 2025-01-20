import {Router} from 'express';
import restaurantAuthController from '../../controllers/restaurantsController/restaurantAuth.controller.js';
const routes=Router();

routes.post('/login',restaurantAuthController.login)
.post('/verifyOTP',restaurantAuthController.verifyOtp)


export default routes;
