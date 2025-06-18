export let cart = JSON.parse(localStorage.getItem('cart')) || []


export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

