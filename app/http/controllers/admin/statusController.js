import order from '../../../models/order.js'

function statusController(){
    return {
             update(req,res){
                order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
                    if(err){
                        return res.redirect('/admin/orders')
                    }
                    //Emit event
                    const eventEmitter= req.app.get('emitter')
                    eventEmitter.emit('orderUpdated',{id:req.body.orderId, status:req.body.status})
                    return res.redirect('/admin/orders')
                })
             }
    }
}

//module.exports =statusController
export default statusController;