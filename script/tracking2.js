import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const trackingItem = JSON.parse(localStorage.getItem('trackingItem')) || []

document.querySelector('.product-info').innerText = trackingItem.name;
document.querySelector('.product-image').src = trackingItem.image;
document.querySelector('.product-quantity').innerText = `Quantity: ${trackingItem.quantity}`;
const deliveryDate = dayjs(trackingItem.deliveryDate)
const formattedDate = deliveryDate.format('dddd, MMMM D')
document.querySelector('.delivery-date').innerText = `Arriving on ${formattedDate}`;



const today = dayjs().startOf('day');

if (today.isBefore(deliveryDate)) {
  document.querySelector('.js-status-preparing').classList.add('current-status');
  document.querySelector('.js-progress-bar').style.width = '18%';
} else if (today.isSame(deliveryDate)) {
  document.querySelector('.js-status-shipped').classList.add('current-status');
  document.querySelector('.js-progress-bar').style.width = '66%';
} else {
  document.querySelector('.js-status-delivered').classList.add('current-status');
  document.querySelector('.js-progress-bar').style.width = '100%';
  document.querySelector('.delivery-date').innerText = `Delivered on ${formattedDate}`;
}
