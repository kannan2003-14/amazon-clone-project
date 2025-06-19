import { cart, removeFromCart, saveToStorage } from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";

let cartHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId

  let matchingProduct;

  products.forEach((product) => {
    if(productId === product.id){
      matchingProduct = product
    }
  })
     
  cartHTML += 
  `
     <div class="cart-item-container js-cart-container" 
     data-product-id="${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
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
                    data-product-id="${matchingProduct.id}"
                    >${cartItem.quantity}</span>
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
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `
})

document.querySelector('.js-order-summary').innerHTML = cartHTML




// Update button
document.querySelectorAll('.update-quantity-link')
.forEach((button) => {
  button.addEventListener('click', () => {
   const productId = button.dataset.productId
   const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`)
   const label = document.querySelector(`.quantity-label[data-product-id="${productId}"]`)

   if(button.textContent.trim() === 'Update'){
    if(label) label.classList.add('hidden')
    if(input) input.classList.remove('hidden')
    button.textContent = 'save'  
   }else{
    const newQuantity = Number(input.value)
    if(newQuantity > 0){
      cart.forEach((cartItem) => {
        if(productId === cartItem.productId){
          cartItem.quantity = newQuantity
        }
      })
      saveToStorage()
      location.reload()
    }
   }
  })
})


// Delete button
document.querySelectorAll('.js-delete-button')
.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId
    // Function in cart.js
    removeFromCart(productId)
    const container = document.querySelector(`.js-cart-container[data-product-id="${productId}"]`)
    container.remove()
    saveToStorage()
  })
})




