import BidForm from "../../models/users/bidForm.model.js";
import User from "../../models/users/userAuth.model.js";
class bidRestarurant{
   async getAllBids(req,res){
     try{
        const {userId}=req.params;
        const bids=await BidForm.find({userId});
        const user=await User.findById(userId);
        if(!user)return res.status(404).json({
            status:false,
            message:'User not found'
        })
        if(userId!=req.user.id)return res.status(403).json({
            status:false,
            message:'wrong user to try access data '
        })
        if(bids.length==0){
            return res.status(404).json({
                status:true,
                message:'No bids found for this user',
            })
        }
        return res.status(200).json({
            status:true,
            bids
        });
     }catch(err){
        return res.status(500).json({
            status:false,
            message:err.message
        });
     }
   }
   async getBidById(req,res){
    try{
        const {bidId}=req.params;
        if(!bidId){
            return res.status(400).json({
                status:false,
                message:'Please provide bidId'
            })
        }
        const bid=await BidForm.findById(bidId);
        if(!bid){
            return res.status(404).json({
                status:false,
                message:'Bid not found'
            })
        }
        return res.status(200).json({
            status:true,
            message:"bid successfully fetched",
            bid
        })

    }catch(err){
        return res.status(500).json({
            status:false,
            message:err.message
        });
 
    }
   }
}

export default new bidRestarurant();
