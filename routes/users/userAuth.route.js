import {Router} from 'express';
import userAuthController from '../../controllers/userController/userAuth.controller.js';
import {userAutherization} from '../../middlewares/auth.js'
import bids from './bid.route.js'
import { upload } from '../../middlewares/multer.js'
const routes = Router();


routes.post('/login',userAuthController.login)
.post('/login/verifyOTP',userAuthController.verifyOtp)
.post('/bidForm/:userId',userAutherization,userAuthController.bidingForm)
.post('/profile',userAutherization,userAuthController.profile)
.get('/profile/',userAutherization,userAuthController.getProfile)
.put('/profile-picture',userAutherization,upload.single('profilePicture'),userAuthController.updateProfilePicture)
.use('/bid',userAutherization,bids)

export default routes;