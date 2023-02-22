function cartController(){
    //Facotry function
    return{
        cart(req,resp){
            resp.render('customers/cart') 
        },
        deleteItem(req,resp){
        
            let cart =req.session.cart
           
            if(cart.items[req.body._id]){

               // console.log(cart.items[req.body._id])
                cart.totalQty=cart.totalQty-cart.items[req.body._id].qty;
                cart.totalPrice=cart.totalPrice-(cart.items[req.body._id].item.prize*cart.items[req.body._id].qty)

                if(cart.totalQty==0){
                  // console.log("called")
                    delete req.session.cart
                }
                else{
                   
                    delete cart.items[req.body._id]
                }
                
             }
             return resp.json({totalQty:cart.totalQty})

        },

        update(req,resp)
        {
    //  let cart ={
    //     items:{
    //         pizzaId:{item:pizzaObject, qty:0},
    //         pizzaId:{item:pizzaObject, qty:0}
    //     },
    //     totalPrice:0,
    //     totalQty:0
    //  }
    
//for the first time creating cart and adding basic object structure

            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            let cart =req.session.cart
           //when cart is empty
           if(!cart.items){
            cart.items={
                item:req.body,
                qty:1,
            }
            cart.totalQty=1;
            cart.totalPrice=req.body.prize
            }
             //check if the item doest not exist in cart
           else if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1,
                }
                cart.totalQty=cart.totalQty+1;
                cart.totalPrice=cart.totalPrice+req.body.prize
            }
            else{
                cart.items[req.body._id].qty=cart.items[req.body._id].qty+1
                cart.totalQty=cart.totalQty+1;
                cart.totalPrice=cart.totalPrice+req.body.prize;
            }
        
           return resp.json({totalQty: req.session.cart.totalQty})
        },
        orderNow(){
            return resp.json({message: 'Working'})

        }
    }
}

//module.exports=cartController;
export default cartController;