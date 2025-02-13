import  {Router} from 'express';
import user, { userProtectedRoutes } from './users/userAuth.route.js'
import restaurant, { restaurantProtectedRoute } from './restaurant/restaurant.js'

import AdminLogin from './admin/login.js'
const router=Router();

router.get('/',(req,res)=>{
    try{
     return res.status(200).json({
         message:'Hello, World!'
     })
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.use('/login',AdminLogin);

router.use('/user',user);
router.use('/user',userProtectedRoutes)
router.use('/restaurant',restaurant);
router.use('/restaurant',restaurantProtectedRoute)

export default router;