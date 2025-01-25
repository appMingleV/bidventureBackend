import {Router} from 'express';
import restaurantAuthController from '../../controllers/restaurantsController/restaurantAuth.controller.js';
import { restaurantAuthorization } from '../../middlewares/auth.js'
import bid from './bid.route.js'
import { upload } from '../../middlewares/multer.js';
const routes=Router();

const restaurantProtectedRoute = Router();

restaurantProtectedRoute.use(restaurantAuthorization);

routes.post('/login',restaurantAuthController.login)
.post('/verifyOTP',restaurantAuthController.verifyOtp)
routes.use('/bid',restaurantAuthorization,bid)

// restaurant protected routes

restaurantProtectedRoute.post(
    '/profile',
    upload.fields([
        { name: 'images', maxCount: 7 }, // Accept up to 5 restaurant images
        { name: 'video', maxCount: 1 },  // Accept 1 restaurant video
        { name: 'dishes.photo', maxCount: 1 }, // Accept up to 10 dish photos
    ]),
    restaurantAuthController.updateRestaurant
)



export default routes;
export { restaurantProtectedRoute }
