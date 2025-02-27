import {Router} from 'express';
import restaurantAuthController from '../../controllers/restaurantsController/restaurantAuth.controller.js';
import { restaurantAuthorization } from '../../middlewares/auth.js'
import bid from './bid.route.js'
import { upload } from '../../middlewares/multer.js';
import bidRestaurantController from '../../controllers/restaurantsController/bidRestaurant.controller.js';
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
        { name: 'images', maxCount: 6 }, // Accept up to 6 restaurant images
        { name: 'video', maxCount: 1 },  // Accept 1 restaurant video
        { name: 'dishes.photo', maxCount: 1 }, // Accept only 1 dish photo
        { name: 'logo', maxCount:1 },
        { name:'coverImage',maxCount:1 }
    ]),
    restaurantAuthController.updateRestaurant
)

    .get('/profile',restaurantAuthController.getSingleRestaurant)
    .get('/all',restaurantAuthController.getAllRestaurants)
    .get('/events',bidRestaurantController.getAllEvents)
    .post('/create-bid',bidRestaurantController.bidding)


export default routes;
export { restaurantProtectedRoute }
