import {Router} from 'express';
import restaurantAuthController from '../../controllers/restaurantsController/restaurantAuth.controller.js';
import {restaurantAutherization} from '../../middlewares/auth.js'
import bid from './bid.route.js'
const routes=Router();

routes.post('/login',restaurantAuthController.login)
.post('/verifyOTP',restaurantAuthController.verifyOtp)
routes.use('/bid',restaurantAutherization,bid)

export default routes;
