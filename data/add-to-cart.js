import { cart } from "./cart.js";
import { saveToStorage } from "./cart.js";

//  update Cart Function
export function updateCartQuantity(){
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  })
    
  document.querySelector('.js-cart-quantity')
  .innerHTML = cartQuantity
  }


  // Total Quantity
  export function cartTotalQuantity(){
    let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  })
  return cartQuantity
  }



  // Add to Cart Function
  
   export function addToCart(productId, selectedQuantity) {
     let matchingItem;
    cart.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingItem = cartItem
      }
    })
  
    if(matchingItem){
      matchingItem.quantity += selectedQuantity
    }else{
      cart.push({
        productId: productId,
        quantity: selectedQuantity,
        deliveryOptionId: '1'
      })
    }
      saveToStorage()
   }



   