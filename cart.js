/* ============================================================
   VEER JI GLOBAL CART ENGINE (For All Product Variety Pages)
   ============================================================ */

// 1. THE MAIN ADD TO CART BRAIN
function addToCart(name, price, btnElement) {
  // Create a clean, unique ID for the food item
  var itemID = 'food-' + name.toLowerCase().replace(/\s+/g, '-');

  // Pull existing cart from browser memory (using the exact same key as the drinks!)
  var cart = JSON.parse(sessionStorage.getItem('veerji_cart') || '[]');

  // Check if this specific item is already inside the cart
  var existingItem = cart.find(function(item) { return item.id === itemID; });

  if (existingItem) {
    existingItem.qty += 1; // If it's there, just add 1 to quantity
  } else {
    // If it's new, inject the full item details
    cart.push({
      id: itemID,
      name: name,
      price: Number(price),
      parent: 'Food Varieties',
      qty: 1
    });
  }

  // Save the updated list back to memory
  sessionStorage.setItem('veerji_cart', JSON.stringify(cart));

  // Instantly update the red and white counters on screen
  updateGlobalCartCounter(cart);

  // PREMIUM VISUAL FEEDBACK: Turns the button green temporarily
  if (btnElement) {
    var originalText = btnElement.innerHTML;
    btnElement.innerHTML = 'Added ✓';
    btnElement.classList.add('added'); // Triggers your green CSS class
    
    setTimeout(function() {
      btnElement.innerHTML = originalText;
      btnElement.classList.remove('added');
    }, 1200);
  }

  // TOAST NOTIFICATION: If your page has a toast element, slide it out
  var toast = document.querySelector('.toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 2000);
  }
}

// 2. THE UNIVERSAL COUNTER UPDATER
// This function checks BOTH element IDs so it never breaks on different pages
function updateGlobalCartCounter(cartData) {
  var cart = cartData || JSON.parse(sessionStorage.getItem('veerji_cart') || '[]');
  var totalItems = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  
  // Updates the count on variety pages (chowmein.html uses id="cartCount")
  var varietyCounter = document.getElementById('cartCount');
  if (varietyCounter) {
    varietyCounter.textContent = totalItems;
  }

  // Updates the count on the main landing page (index.html uses id="main-cart-counter")
  var mainCounter = document.getElementById('main-cart-counter');
  if (mainCounter) {
    mainCounter.textContent = totalItems;
  }
}

// 3. AUTO-RUN ON PAGE LOAD
// This makes sure the numbers don't reset to 0 when someone refreshes or changes pages
window.addEventListener('DOMContentLoaded', function() {
  updateGlobalCartCounter();
});
