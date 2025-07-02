import { cart, clearCart, findMatchingItem, removeFromCart, saveToStorage } from "../data/cart.js";
import { deliveryOptions, findDeliveryOption } from "../data/deliveryOption.js";
import { findMatchingProduct, products } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"
import formatCurrency from "./utils/money.js";
import { cartTotalQuantity } from "../data/add-to-cart.js";

function renderOrderSummary() {

    if(cart.length === 0){
    document.querySelector('.js-order-summary')
    .innerHTML = `
      <p>Your Cart is Empty.</p>
      <a href="amazon.html">
      <button class="view-product-button button-primary">View Products</button>
      </a>
    `
    document.querySelector('.js-checkout-item')
    .textContent = '0 item'
    return
  }


  const totalQuantity = cartTotalQuantity()
  document.querySelector('.js-checkout-item')
  .textContent = `${totalQuantity} ${totalQuantity === 1 ? 'item': 'items'}`


let cartHTML = '';

cart.forEach((cartItem) => {
const productId = cartItem.productId
const matchingProduct = findMatchingProduct(productId)
const deliveryOptionId = cartItem.deliveryOptionId
const deliveryOption = findDeliveryOption(deliveryOptionId)

  const today = dayjs()
  const deliveryDate = today.add(deliveryOption.deliverydays, 'days')
  const dateString = deliveryDate.format('dddd, MMMM D')

  cartHTML += `
       <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">


                  <span>
                    Quantity: <span class="quantity-label"
                    data-product-id="${matchingProduct.id}">
                    ${cartItem.quantity}</span>
                  </span>


                  <input type="number"
                  class="quantity-input hidden"
                  data-product-id="${matchingProduct.id}"
                  value="${cartItem.quantity}"
                  min="1">



                  <span class="update-quantity-link link-primary js-update-button"
                  data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-button"
                  data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
        
                ${deliveryOptionHTML(matchingProduct, cartItem)}
 
           
              </div>
            </div>
          </div>
`

})

document.querySelector('.js-order-summary')
.innerHTML = cartHTML


// Delivery Option

function deliveryOptionHTML(matchingProduct, cartItem){
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
  const today = dayjs()
  const deliveryDate = today.add(deliveryOption.deliverydays, 'days')
  const dateString = deliveryDate.format('dddd, MMMM D')
  // ternary operators
  const priceString = deliveryOption.priceCents === 0
  ? 'FREE'
  : `$${formatCurrency(deliveryOption.priceCents)}`

  const isChecked = deliveryOption.id === cartItem.deliveryOptionId

  html += `
    
    <div class="delivery-option js-delivery-option"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
      <input type="radio"
      ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} - Shipping
        </div>
      </div>
    </div>
  `

  })

  return html
}




// Delete button
document.querySelectorAll('.js-delete-button')
.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId
    removeFromCart(productId)
    const container = document.querySelector(`.js-cart-item-container-${productId}`)
    container.remove()
    saveToStorage()
    renderPaymentSummary()
    renderOrderSummary()
    renderDelivery()
  })
})


// Update button

document.querySelectorAll('.js-update-button')
.forEach((button) => {
  button.addEventListener('click', () => {
  const productId = button.dataset.productId
  const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`)
  const label = document.querySelector(`.quantity-label[data-product-id="${productId}"]`)

  if(button.textContent.trim() === 'Update'){
    input.classList.remove('hidden')
    label.classList.add('hidden')
    button.textContent = 'save'
  }else{
    const newQuantity = Number(input.value)
    if(newQuantity > 0){
      cart.forEach((cartItem) => {
        if(productId === cartItem.productId)
        cartItem.quantity = newQuantity
      })
      saveToStorage()
      location.reload()
    }
  }
  })
})



// Delivery option

document.querySelectorAll('.js-delivery-option')
.forEach((element) => {
  element.addEventListener('click', () => {
  const {productId, deliveryOptionId} = element.dataset
  const matchingItem = findMatchingItem(productId)
  matchingItem.deliveryOptionId = deliveryOptionId
   saveToStorage()
   renderOrderSummary()
   renderPaymentSummary()
   renderDelivery()
  })
})
}

renderOrderSummary()

function calculateCartTotal(){
  let productPriceCents = 0
  let shippingPriceCents = 0

  cart.forEach((cartItem) => {

  const productId = cartItem.productId
  const matchingProduct = findMatchingProduct(productId)

  productPriceCents += matchingProduct.priceCents * cartItem.quantity

  const deliveryOptionId = cartItem.deliveryOptionId
  const deliveryOption = findDeliveryOption(deliveryOptionId)

    shippingPriceCents += deliveryOption.priceCents

  })

  const totalBeforeTax = productPriceCents + shippingPriceCents
  const taxCents = totalBeforeTax * 0.1
  const totalCents = totalBeforeTax + taxCents

  return {
    productPriceCents,
    shippingPriceCents,
    totalBeforeTax,
    taxCents,
    totalCents
  }
}

function renderPaymentSummary() {
  const {
    productPriceCents,
    shippingPriceCents,
    totalBeforeTax,
    taxCents,
    totalCents
  } = calculateCartTotal()

  const totalQuantity = cartTotalQuantity()
  

  const cartDisabled = cart.length === 0
  ? 'disabled style="background-color:rgb(221, 194, 126); color: black; cursor: not-allowed"'
  : ''

  const paymentSummaryHTML = `
   
           <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order-button" ${cartDisabled}>
            Place your order
          </button>
  
  `
  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummaryHTML
}

renderPaymentSummary()
renderDelivery()

function renderDelivery() {

  document.querySelector('.js-place-order-button')
  .addEventListener('click', () => {
    const {totalCents} = calculateCartTotal()

    const order = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    cartTotalCents: totalCents,
    cart: cart.map(cartItem => ({
      ...cartItem
    }))
  }

  const existingOrders = JSON.parse(localStorage.getItem('orders')) || []
  existingOrders.push(order)
  localStorage.setItem('orders', JSON.stringify(existingOrders))


  clearCart()
  window.location.href = 'orders.html'
 

  })
    
}







