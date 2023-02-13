import axios
    from "axios";
import initAdmin from "./admin";
import moment from "moment";
const addToCart = document.querySelectorAll('.add-to-cart') //class
const cartCounter = document.querySelector('#cartCounter') //id
const deleteCartButton = document.querySelectorAll('#deleteCartButton')


deleteCartButton.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = btn.dataset.pizza_item;
        //let pizza = JSON.parse(btn.dataset.pizza_item);
        deleteItemInCart(pizza)
    })
});

function deleteItemInCart(_id) {
    axios.post("/delete-cart", {_id}).then(res => { 
        window.location.reload();
    }).catch(err =>{
      
    })
}

function updateCart(pizza) {
    axios.post("/update-cart", pizza).then(res => { 
        alert("Item added to cart");
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
