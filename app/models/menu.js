import mongoose, { Schema }  from "mongoose";
const menuSchema=new Schema(
    {
        name:{type:String,require:true},
        prize:{type:Number,require:true},
        size:{type:String,require:true},
        image:{type:String,require:true}
        // image:{type:String,require:true,get: (image)=>{
        //     return `${APP_URL}${img}${image}`;
        // }}
    
},{timestamps:true,toJSON:{getters:true},id:false} );

//module.exports= mongoose.model('Menu',menuSchema);
export default  mongoose.model('Menu',menuSchema);