import {Router} from 'express';
import userAuthController from '../../controllers/userController/userAuth.controller.js';
import {userAutherization} from '../../middlewares/auth.js'
import bids from './bid.route.js'
const routes = Router();


routes.post('/login',userAuthController.login)
.post('/login/verifyOTP',userAuthController.verifyOtp)
.post('/bidForm/:userId',userAutherization,userAuthController.bidingForm)
.post('/profile/:userId',userAutherization,userAuthController.profile)
.get('/profile/:userId',userAutherization,userAuthController.getProfile)
.use('/bid',userAutherization,bids)

export default routes;