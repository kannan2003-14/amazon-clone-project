import { cart } from "../data/cart.js"

const trackingItem = JSON.parse(localStorage.getItem('trackingItem'))

if(trackingItem) {

  function getDateOnly(date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  const today = getDateOnly(new Date()) 
  const deliveryDate = getDateOnly(new Date(trackingItem.date)) 
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  })
  
  document.querySelector('.delivery-date').innerText = `Arriving On ${formattedDate}`
  document.querySelector('.product-info').innerText = trackingItem.name
  document.querySelector('.product-image').src = trackingItem.image
  document.querySelector('.product-quantity').innerText = `Quantity: ${trackingItem.quantity}`
  const preparing = document.querySelector('.js-status-preparing');
  const shipped = document.querySelector('.js-status-shipped');
  const delivered = document.querySelector('.js-status-delivered');
  
  [preparing, shipped, delivered].forEach((label) => {
    label.classList.remove('active')
  })
  
  const daysLeft = Math.floor((deliveryDate - today) / (1000 * 60 * 60 * 24));
 

  const progressBar = document.querySelector('.js-progress-bar')

  if(daysLeft > 2){
    progressBar.style.width = '33%'
    preparing.classList.add('active')

  }else if(daysLeft > 0){
    progressBar.style.width = '80%'
    shipped.classList.add('active')
  }else{
    progressBar.style.width = '100%'
    delivered.classList.add('active')
    document.querySelector('.delivery-date')
    .innerHTML = `Delivered On ${formattedDate}`
  }
}


ordersQuantity()
  
function ordersQuantity(){
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  })

  document.querySelector('.js-cart-quantity')
  .innerHTML = cartQuantity
}

 