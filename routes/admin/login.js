import  { Router } from 'express';
import { adminRegister, adminLogin , getAllUsers} from '../../controllers/adminController/loginController.js';

const router = Router();

router.post('/adminRegister', adminRegister);

router.post('/adminLogin', adminLogin);

router.get('/getAllUsers',  getAllUsers );

router.get('/getAllRestaurants',  getAllUsers );  



export default router;