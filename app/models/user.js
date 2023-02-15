import mongoose, { Schema }  from "mongoose";
const img="img/";

const schema=mongoose.schema;
const userSchema=new Schema(
    {
        name:{type:String,require:true},
        email:{type:String,require:true,unique:true},
        password:{type:String,require:true},
        role:{type:String,require:false,default:'customer'},

},{timestamps:true} );

//module.exports= mongoose.model('User',userSchema);
export default  mongoose.model('User',userSchema);