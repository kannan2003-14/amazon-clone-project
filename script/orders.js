import { deliveryOptions } from "../data/deliveryOption.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js"; 

const orders = JSON.parse(localStorage.getItem('orders')) || []

let orderHTML = '';

orders.slice().reverse().forEach((order) => {
  const orderDate = new Date(order.date)
  const formatDate = orderDate.toLocaleDateString('en-US',{
    month: 'long',
    day: 'numeric'
  })

  const orderId = order.id
  const total = formatCurrency(order.cartTotalCents)

  let orderItemsHTML = '';

  order.cart.forEach((cartItem) => {

    // getProductID
    const productId = cartItem.productId
    let matchingProduct;
    products.forEach((product) => {
    if(productId === product.id){
      matchingProduct = product
    }
    })

  // getDeliveryOptionID
  const deliveryOptionId = cartItem.deliveryOptionId
  let deliveryOption
  deliveryOptions.forEach((option) => {
    if(deliveryOptionId === option.id){
     deliveryOption = option
    }
  })

  // Estimated delivery date
  const deliveryDate = new Date(order.date)
  deliveryDate.setDate(deliveryDate.getDate() + deliveryOption.deliverydays)

  const formatDeliveryDate = deliveryDate.toLocaleDateString('en-US',{
    month: 'long',
    day: 'numeric'
  })

    orderItemsHTML += `
     
       <div class="product-image-container">
              <img src="${matchingProduct.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${formatDeliveryDate}
              </div>
              <div class="product-quantity">
                Quantity: ${cartItem.quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary">
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


