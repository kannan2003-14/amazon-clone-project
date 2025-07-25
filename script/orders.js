import { cartTotalQuantity, updateCartQuantity } from "../data/add-to-cart.js";
import { cart, pushCart } from "../data/cart.js";
import { deliveryOptions, findDeliveryOption } from "../data/deliveryOption.js";
import { findMatchingProduct, products } from "../data/products.js";
import formatCurrency from "./utils/money.js"; 
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"


const orders = JSON.parse(localStorage.getItem('orders')) || []

let orderHTML = '';

orders.slice().reverse().forEach((order) => {
  const orderDate = dayjs(order.date)
  const formatDate = orderDate.format('MMMM D')
  const orderId = order.id
  const total = formatCurrency(order.cartTotalCents)

  let orderItemsHTML = '';

  order.cart.forEach((cartItem) => {

    // getProductID
    const productId = cartItem.productId
    const matchingProduct = findMatchingProduct(productId)

  // getDeliveryOptionID
  const deliveryOptionId = cartItem.deliveryOptionId
  const deliveryOption = findDeliveryOption(deliveryOptionId)

  // Estimated delivery date
  const deliveryDate = orderDate.add(deliveryOption.deliverydays, 'day')

  const formatDeliveryDate = deliveryDate.format('MMMM D')

  const isDelivered = dayjs() >= deliveryDate
  const deliveryLabel = isDelivered ? 'Delivered On:' : 'Arriving On'

    orderItemsHTML += `
     
       <div class="product-image-container">
              <img src="${matchingProduct.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                 ${deliveryLabel} ${formatDeliveryDate}
              </div>
              <div class="product-quantity">
                Quantity: ${cartItem.quantity}
              </div>
              <button class="buy-again-button button-primary"
              data-product-id="${matchingProduct.id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message js-buy-again-btn">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary js-tracking-button"
                data-product-name="${matchingProduct.name}"
                data-product-image="${matchingProduct.image}"
                data-product-delivery-date="${deliveryDate.toISOString()}"
                data-quantity="${cartItem.quantity}">
                  Track package
                </button>
              </a>
            </div>
    `

})




orderHTML += `
 
    <div class="order-container">
      
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formatDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${total}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${orderId}</div>
        </div>
      </div>

      <div class="order-details-grid">
      ${orderItemsHTML}
      </div>
    </div>

`

})



document.querySelector('.js-orders-grid').innerHTML = orderHTML

document.querySelectorAll('.buy-again-button')
.forEach((button) => {
  button.addEventListener('click', () => {
    const span = button.querySelector('.js-buy-again-btn')
    const img = button.querySelector('.buy-again-icon')
    const productId = button.dataset.productId
    const originalText = span.innerText

    pushCart(productId)
    updateCartQuantity()

    if(button.resetTimeout){
      clearTimeout(button.resetTimeout)
    }

    img.style.display = 'none'
    span.innerText = '✔ Added'
    button.disabled = true

    button.resetTimeout = setTimeout(() => {
      img.style.display = 'inline'
      span.innerText = originalText
      button.disabled = false
      button.resetTimeout = null
    }, 2000);
  })
})


 updateCartQuantity()
 


document.querySelectorAll('.js-tracking-button')
.forEach((button) => {
  button.addEventListener('click', () => {
  const { productName, productImage, productDeliveryDate, quantity} = button.dataset 

  const trackingData = {
    name: productName,
    image: productImage,
    deliveryDate: productDeliveryDate,
    quantity: quantity
  }


  localStorage.setItem('trackingItem', JSON.stringify(trackingData))

  window.location.href = 'tracking.html'
  })
})
  