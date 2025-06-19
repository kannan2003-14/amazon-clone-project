export let cart = JSON.parse(localStorage.getItem('cart')) || []


export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}


export function removeFromCart(productId) {
      const newCart = []
    cart.forEach((cartItem) => {
    if(productId !== cartItem.productId){
      newCart.push(cartItem)
    }
    })
    cart = newCart
}