import  { Router } from 'express';
import { adminRegister, adminLogin , getAllUsers, getAllRestaurants} from '../../controllers/adminController/loginController.js';
import restaurantAuthController from '../../controllers/restaurantsController/restaurantAuth.controller.js';
import { adminAuth } from '../../middlewares/auth.js';


const AdminRouter = Router();

AdminRouter.post('/adminRegister', adminRegister)
    .post('/login', adminLogin)

const AdminProtectedRouter = Router();
AdminProtectedRouter.use(adminAuth)

AdminProtectedRouter
    .get('/users',  getAllUsers )
    .get('/restaurants',  getAllRestaurants )
    .get('/restaurants/profile', restaurantAuthController.getSingleRestaurant )


export { AdminRouter,AdminProtectedRouter };