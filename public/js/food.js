// Load menu on page load
document.addEventListener('DOMContentLoaded', loadMenu);

async function loadMenu() {
  try {
    const response = await fetch('/api/food');
    const foods = await response.json();
    const container = document.getElementById('menuContainer');
    container.innerHTML = foods.map((food, index) => `
      <div class="food-card-wrapper">
        <div class="food-card" data-category="${food.category === 'Appetizer' ? 'appetizers' : food.category === 'Main Course' ? 'main-course' : food.category === 'Dessert' ? 'desserts' : food.category === 'Beverage' ? 'beverages' : food.category.toLowerCase().replace(' ', '-')}">
          <div class="food-image">
            <img src="${food.image || '/images/food.jpg'}" alt="${food.name}" loading="lazy">
            <div class="food-overlay"></div>
          </div>
          <div class="food-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="food-title">${food.name}</h5>
              <span class="food-category">${food.category}</span>
            </div>
            <p class="food-description">${food.description}</p>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="food-price">₹${food.price.toLocaleString()}</span>
              <div class="d-flex gap-2">
                ${food.vegetarian ? '<i class="fas fa-leaf text-success" title="Vegetarian"></i>' : ''}
                ${food.spicy ? '<i class="fas fa-fire text-danger" title="Spicy"></i>' : ''}
              </div>
            </div>
            <button class="btn-order" onclick="addFoodToCart('${food._id}', '${food.name}', ${food.price}, '${food.image || '/images/food.jpg'}', '${food.category}')">
              <i class="fas fa-cart-plus me-2"></i>Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading menu:', error);
  }
}

function addFoodToCart(id, name, price, image, category) {
  // Create cart item
  const cartItem = {
    id: id,
    type: 'food',
    name: name,
    price: price,
    image: image,
    quantity: 1,
    details: {
      category: category
    }
  };

  // Add to cart using the global cart function
  if (typeof addToCart === 'function') {
    addToCart(cartItem);
  } else {
    alert('Cart functionality not available. Please refresh the page.');
  }
}