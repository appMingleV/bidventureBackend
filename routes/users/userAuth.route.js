import {Router} from 'express';
import userAuthController from '../../controllers/userController/userAuth.controller.js';
import {userAutherization} from '../../middlewares/auth.js'
import bids from './bid.route.js'
import { upload } from '../../middlewares/multer.js'
const routes = Router();

const userProtectedRoutes = routes.use(userAutherization);

// user's public routes
routes
    .post('/login',userAuthController.login)
    .post('/login/verifyOTP',userAuthController.verifyOtp)

// user protected routes
userProtectedRoutes
    .post('/bidForm/:userId',userAuthController.bidingForm)
    .post('/profile',userAuthController.profile)
    .get('/profile/',userAuthController.getProfile)
    .put('/profile-picture',upload.single('profilePicture'),userAuthController.updateProfilePicture)
    .use('/bid',bids)
    .put('/cancel-event/:id',userAuthController.updateEventStatus)

export default routes;
export { userProtectedRoutes }