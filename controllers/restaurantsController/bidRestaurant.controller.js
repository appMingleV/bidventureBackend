import BidForm from "../../models/users/bidForm.model.js";

class bidRestarurant{
   async getAllEvents(req,res){
     try{
        const Events = await BidForm.find({eventStatus:"Pending"});
        if(Events.length==0){
            return res.status(404).json({
                status:true,
                message:'No new events found',
            })
        }
        return res.status(200).json({
            status:true,
            Events
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
        console.log(bidId)
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
