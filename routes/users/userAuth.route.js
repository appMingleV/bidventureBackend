import {Router} from 'express';
import userAuthController from '../../controllers/userController/userAuth.controller.js';
import {userAutherization} from '../../middlewares/auth.js'
import bids from './bid.route.js'
import { upload } from '../../middlewares/multer.js'
import restaurantAuthController from '../../controllers/restaurantsController/restaurantAuth.controller.js';
const routes = Router();
const userProtectedRoutes = Router();

userProtectedRoutes.use(userAutherization);

// user's public routes

routes
    .post('/login',userAuthController.login)
    .post('/login/verifyOTP',userAuthController.verifyOtp)

// user protected routes


userProtectedRoutes
    .post('/bidForm/:userId',userAuthController.bidingForm)
    .post('/profile',userAuthController.profile)
    .get('/profile',userAuthController.getProfile)
    .put('/profile-picture',upload.single('profilePicture'),userAuthController.updateProfilePicture)

    // .get('/allUsers',userAuthController.getAllUsers)




    .use('/bid',bids)
    .put('/cancel-event/:id',userAuthController.updateEventStatus)
    .post('/update-event/:id',userAuthController.updateEventDetails)
    .get('/restaurants',restaurantAuthController.getAllRestaurants)
    .get('/restaurants/:id',restaurantAuthController.getSingleRestaurant)

export default routes;
export { userProtectedRoutes }