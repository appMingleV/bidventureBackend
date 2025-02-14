import  { Router } from 'express';
import { adminRegister, adminLogin , getAllUsers} from '../../controllers/adminController/loginController.js';

const AdminRouter = Router();

AdminRouter.post('/adminRegister', adminRegister);

AdminRouter.post('/login', adminLogin);

AdminRouter.get('/users',  getAllUsers );

AdminRouter.get('/restaurants',  getAllUsers );  



export default AdminRouter;