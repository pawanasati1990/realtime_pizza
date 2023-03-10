import mongoose from "mongoose"
import Order from "../../../models/order.js"
import moment from "moment"
function orderController() {
    //Facotry function
    return {
        store(req, resp) {

            const { address, phone } = req.body

            if (!address || !phone) {
                req.flash('error', 'All field are required')
                return resp.redirect('/cart')

            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })

            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully')
                    delete req.session.cart
                    //Emit event
                    const eventEmitter = req.app.get('emitter')
                    eventEmitter.emit('orderPlaced', placedOrder)

                    return resp.redirect('customer/orders')
                })

            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return resp.redirect('/cart')
            })


        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }
}

//module.exports = orderController;

export default orderController;