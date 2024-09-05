import mongoose from "mongoose"

const OfferModel=new mongoose.Schema({
    Offerurl:{
        type:String,
        required:true
    },
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    }
})

export const OfferLetter=mongoose.model.OfferLetter || mongoose.model("OfferLetter",OfferModel)