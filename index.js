import { v4 as uuid } from "uuid";
import { menuArray } from "./data.js";
const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("total-cost");
const completeOrderBtn = document.getElementById("complete-btn");
const closeBtn = document.getElementById("close-btn");
const checkoutModal = document.getElementById("checkout-modal");
const orderSummary = document.getElementById("order-summary");
const payBtn = document.getElementById("pay-btn");
const orderSummaryResponse = document.getElementById("order-summary-response");
const fullName = document.getElementById("full-name");
const creditCardNumber = document.getElementById("credit-card");
const ccv = document.getElementById("ccv");

const form = document.querySelector("form");
let validName = false;
let validCreditCard = false;
let validCCV = false;

let cart = [];

function validate() {
  let creditCardRegex = new RegExp(/\b\d{16}\b/);
  let ccvRegex = new RegExp(/\b\d{3,4}\b/);

  let name = document.getElementById("full-name-label");
  let creditCardNumberLabel = document.getElementById("credit-card-label");
  let ccvNumber = document.getElementById("ccv-label");
  validName = false;
  if (fullName.value !== "") {
    validName = true;
    name.textContent = "";
  } else {
    name.textContent = "retype the anme ";
  }

  if (creditCardRegex.test(creditCardNumber.value)) {
    creditCardNumberLabel.textContent = "";
    validCreditCard = true;
  } else {
    creditCardNumberLabel.textContent = "retype the credit card ";
    validCreditCard = false;
  }

  if (ccvRegex.test(ccv.value)) {
    validCCV = true;
    ccvNumber.textContent = "";
  } else {
    ccvNumber.textContent = "retype the credit card ";
    validCCV = false;
  }

  return validName && validCreditCard && validCCV;
}
function deleteItem(itemId) {
  cart = cart.filter(item => {
    return item.id !== itemId;
  });
  if (cart.length === 0) {
    orderSummary.style.display = "none";
  } else render();
}

completeOrderBtn.addEventListener("click", completeOrder);

closeBtn.addEventListener("click", function () {
  checkoutModal.style.display = "none";
});

payBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (validate()) {
    checkoutModal.style.display = "none";
    cart.length = 0;
    orderSummary.style.display = "none";
    form.reset();
    orderSummaryResponse.style.display = "flex";

    return;
  }
});

function completeOrder() {
  checkoutModal.style.display = "flex";
}
function addToCart(name, price) {
  cart.push({
    name,
    price,
    qty: 1,
    id: uuid(),
  });

  orderSummaryResponse.style.display = "none";

  orderSummary.style.display = "block";
  completeOrderBtn.disabled = false;
  render();
}

function render() {
  let orderHtml = "";

  const total = cart.reduce((acc, curVal) => acc + Number(curVal.price), 0);
  orderHtml = cart
    .map(
      item =>
        `<li>
  <div class="item-list">
    <div class="item-list-name">
      <p>${item.name}</p>
      <button class="item-list-btn" id="remove-btn" data-item-id =${item.id}>remove</button>
    </div>
    <p>$${item.price}</p>
  </div>
</li>`
    )
    .join(" ");

  orderList.innerHTML = orderHtml;
  orderTotal.textContent = `$${total}`;

  const removeBtn = document.querySelectorAll("#remove-btn");
  removeBtn.forEach(item => {
    item.addEventListener("click", () => deleteItem(item.dataset.itemId));
  });
}

function renderMenuItems() {
  document.getElementById("menu-container").innerHTML = menuArray.map(
    menuItem =>
      ` <div class="item-container">
       <p class="pizza" >${menuItem.emoji}</p>
      <div class="item-details">
        <h3>${menuItem.name}</h3>
        <p>pepproni, mushrooms, mozrella</p>
        <p class="price">$${menuItem.price}</p>
      </div>
      <button class="button" id="add-to-cart" name="Pizza" data-price="14">
        +
      </button>
    </div>`
  );

  const addBtn = document.querySelectorAll("#add-to-cart");
  addBtn.forEach(option => {
    option.addEventListener("click", () => addToCart(option.name, option.dataset.price));
  });
}
renderMenuItems();
