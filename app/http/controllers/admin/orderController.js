import order from '../../../models/order.js'
function  adminContorller(){
    return{
        index(req,res){
           order.find({status:{$ne: 'completed'}},null,{sort:{'createdAt':-1}})
            .populate('customerId','-password').exec((err,orders)=>{
                if(req.xhr){
                        return res.json(orders)
                }else{
                    res.render('admin/orders')
                }
            })
        }


    }

}

//module.exports = adminContorller;
export default adminContorller;