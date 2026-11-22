let cartCount = 0;

function addToCart(itemName) {
  cartCount++;
  document.getElementById("cart-count").innerText = cartCount;
  alert(itemName + " added to cart!");
}

function showCart() {
  if (cartCount === 0) {
    alert("Your cart is empty.");
  } else {
    alert("You have " + cartCount + " item(s) in your cart.");
  }
}

document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();
  let userName = document.getElementById("name").value;
  alert("Thank you, " + userName + "! Your message has been sent.");
  this.reset();
});