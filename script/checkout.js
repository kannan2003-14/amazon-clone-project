import { cart, removeFromCart, saveToStorage } from "../data/cart.js";
import { deliveryOptions } from "../data/deliveryOption.js";
import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"
import formatCurrency from "./utils/money.js";


function renderOrderSummary() {
let cartHTML = '';

cart.forEach((cartItem) => {
const productId = cartItem.productId

let matchingProduct;
products.forEach((product) => {
  if(productId === product.id) {
    matchingProduct = product
  }
})
const deliveryOptionId = cartItem.deliveryOptionId

let deliveryOption;

deliveryOptions.forEach((option) => {
  if(option.id === deliveryOptionId){
    deliveryOption = option
  }
})

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
  let matchingItem
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
    matchingItem = cartItem
    }
  })
  matchingItem.deliveryOptionId = deliveryOptionId
   saveToStorage()
   renderOrderSummary()
   renderPaymentSummary()
  })
})
}

renderOrderSummary()

function calculateCartTotal(){
  let productPriceCents = 0
  let shippingPriceCents = 0

  cart.forEach((cartItem) => {


    let matchingProduct
    products.forEach((product) => {
      const productId = cartItem.productId
      if(productId === product.id){
        matchingProduct = product
      }
    })

  productPriceCents += matchingProduct.priceCents * cartItem.quantity

    let deliveryOption
    deliveryOptions.forEach((option) => {
      const deliveryOptionId = cartItem.deliveryOptionId
      if(option.id === deliveryOptionId){
        deliveryOption = option
      }
    })

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

  let totalQuantity = 0
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity
  })

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

          <button class="place-order-button button-primary">
            Place your order
          </button>
  
  `
  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummaryHTML
}

renderPaymentSummary()




