import homeController from '../app/http/controllers/homeController.js'
import authController from '../app/http/controllers/authController.js'
import cartController from '../app/http/controllers/customers/cartController.js'
import orderController from '../app/http/controllers/customers/orderContorllers.js'


import adminController from '../app/http/controllers/admin/orderController.js'
import statusController from '../app/http/controllers/admin/statusController.js'

//Middleware
import geust from '../app/http/middleware/geust.js';
import  auth from '../app/http/middleware/auth.js';
import  admin from '../app/http/middleware/admin.js';

function initRoutes(app){
    app.get('/',homeController().index);
    app.get('/cart',cartController().cart);
    app.post('/update-cart',cartController().update);
    app.post('/delete-cart',cartController().deleteItem);
    app.post('/add_pizza_qty',cartController().addPizzaQty);
    app.post('/minus_pizza_qty',cartController().removePizzaQty);

    app.get('/login',geust,authController().login);
    app.post('/login',authController().postLogin);
    app.get('/register',geust,authController().register);
    app.post('/register',authController().postRegister);
    app.post('/logout',authController().logout);

    //Customer route
    app.post('/orders',auth,orderController().store);
    app.get('/customer/orders',auth,orderController().index);
    app.get('/customer/orders/:id',auth,orderController().show);

    //Admin route
    app.get('/admin/orders',admin,adminController().index);
    app.post('/admin/order/status',admin,statusController().update);

}


//module.exports=initRoutes
export default initRoutes

