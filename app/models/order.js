import mongoose, { Mongoose, Schema }  from "mongoose";

const orderSchema=new Schema(
    {
        customerId:{type:mongoose.Schema.Types.ObjectId,require:true, ref:'User',
    } ,
        items:{type:Object,require:true},
        phone:{type:String,require:true},
        address :{type:String,require:true},
        paymentType :{type:String,default:"COD"},
        status :{type:String,default:"order_placed"},

},{timestamps:true,id:false} );

module.exports= mongoose.model('Order',orderSchema);