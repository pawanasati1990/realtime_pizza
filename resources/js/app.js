import axios
    from "axios";
import initAdmin from "./admin";
import moment from "moment";
import toast from 'toast-me';
const addToCart = document.querySelectorAll('.add-to-cart') //class
const cartCounter = document.querySelector('#cartCounter') //id
const deleteCartButton = document.querySelectorAll('#deleteCartButton')
const minuspizzabtn = document.querySelectorAll('#minuspizzabtn')
const addpizzabtn = document.querySelectorAll('#addpizzabtn')
const toatal_amount = document.getElementById('toatal_amount')
const pizza_list = document.querySelector('#pizza_list')

//let loadData='<%-loadData%>'


minuspizzabtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = btn.dataset.pizza_item;
        addOrRemovePizzaQty(pizza, false)
    })
});


addpizzabtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = btn.dataset.pizza_item;
        addOrRemovePizzaQty(pizza, true)
    })
});

function addOrRemovePizzaQty(_id, isAdd) {
    axios.post(isAdd ? "/add_pizza_qty" : "/minus_pizza_qty", { _id }).then(res => {
        //window.location.reload();
        cartCounter.innerText = res.data.cart.totalQty
        toatal_amount.innerText = res.data.cart.totalPrice
        window.location.reload();
        //pizza_item_count.innerText = res.data.cart.items[req.body._id].qty;
    }).catch(err => {
        console.log(err)
    })
}

deleteCartButton.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = btn.dataset.pizza_item;
        //let pizza = JSON.parse(btn.dataset.pizza_item);
        deleteItemInCart(pizza)
    })
});

function showToast(msg) {
    toast(msg, { duration: 1000, toastClass: 'my-toast-class' /* ... */ });
}

function deleteItemInCart(_id) {
    axios.post("/delete-cart", { _id }).then(res => {
        window.location.reload();
    }).catch(err => {

    })
}

function updateCart(pizza) {
    axios.post("/update-cart", pizza).then(res => {
        showToast('Item added to cart')
        // toast('Item added to cart', { duration: 1000, toastClass: 'my-toast-class' /* ... */ });
        cartCounter.innerText = res.data.totalQty

    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza)

    })
});

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}



//changge order status
let statuses = document.querySelectorAll(".status-line")
let hiddenInput = document.querySelector("#hiddenInput")

let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true

    statuses.forEach((status) => {

        let dataProp = status.dataset.status

        if (stepCompleted) {
            status.classList.add('step-completed')

        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')

            }
        }

    })
}

updateStatus(order)

//Socket
let socket = io()
//join
if (order) {
    socket.emit('join', `order_${order._id}`)
}

let admintAreaPath = window.location.pathname
if (admintAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order } //copy object
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    console.log(data)
    updateStatus(updatedOrder)
})
