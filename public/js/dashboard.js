// Dashboard functionality
console.log('Dashboard JS loaded at:', new Date().toISOString());

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired at:', new Date().toISOString());
  initializeDashboard();
});

function initializeDashboard() {
  console.log('Initializing dashboard at:', new Date().toISOString());
  loadUserProfile();
  loadDashboardStats();
  loadRecentActivity();
  setupNavigation();
}

// Setup navigation event listeners
function setupNavigation() {
  console.log('Setting up navigation...');

  // Use direct onclick assignment for reliability
  setTimeout(() => {
    setupSimpleNavigation();
  }, 100); // Small delay to ensure DOM is ready
}

function setupSimpleNavigation() {
  console.log('Setting up simple navigation...');

  // Get elements and attach onclick handlers directly
  const roomsNav = document.getElementById('rooms-nav');
  const menuNav = document.getElementById('menu-nav');
  const facilitiesNav = document.getElementById('facilities-nav');
  const bookingsNav = document.getElementById('bookings-nav');
  const ordersNav = document.getElementById('orders-nav');
  const profileNav = document.getElementById('profile-nav');
  const settingsNav = document.getElementById('settings-nav');
  const supportNav = document.getElementById('support-nav');
  const logoutBtn = document.getElementById('logout');

  if (roomsNav) {
    roomsNav.onclick = function(e) {
      e.preventDefault();
      showRooms();
      return false;
    };
  }

  if (menuNav) {
    menuNav.onclick = function(e) {
      e.preventDefault();
      showMenu();
      return false;
    };
  }

  if (facilitiesNav) {
    facilitiesNav.onclick = function(e) {
      e.preventDefault();
      showFacilities();
      return false;
    };
  }

  if (bookingsNav) {
    bookingsNav.onclick = function(e) {
      e.preventDefault();
      showMyBookings();
      return false;
    };
  }

  if (ordersNav) {
    ordersNav.onclick = function(e) {
      e.preventDefault();
      showMyOrders();
      return false;
    };
  }

  if (profileNav) {
    profileNav.onclick = function(e) {
      e.preventDefault();
      showProfile();
      return false;
    };
  }

  if (settingsNav) {
    settingsNav.onclick = function(e) {
      e.preventDefault();
      showSettings();
      return false;
    };
  }

  if (supportNav) {
    supportNav.onclick = function(e) {
      e.preventDefault();
      showSupport();
      return false;
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = function(e) {
      e.preventDefault();
      handleLogout();
      return false;
    };
  }

  // Service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.onclick = function() {
      const actions = [showRooms, showMenu, showFacilities];
      if (actions[index]) {
        actions[index]();
      }
    };
  });

  // Quick action buttons
  const quickActions = document.querySelectorAll('.stats-section .btn');
  quickActions.forEach((btn) => {
    btn.onclick = function() {
      const text = this.textContent.trim();
      if (text.includes('View All Bookings')) {
        showMyBookings();
      } else if (text.includes('View Order History')) {
        showMyOrders();
      } else if (text.includes('Update Profile')) {
        showProfile();
      } else if (text.includes('Contact Support')) {
        showSupport();
      }
    };
  });

  console.log('Navigation setup complete');
}

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/';
  }
}

// Load user profile information
async function loadUserProfile() {
  try {
    const response = await fetch('/api/auth/profile');
    if (response.ok) {
      const user = await response.json();
      document.getElementById('userName').textContent = user.name || 'User';
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    // Load room bookings count
    const roomBookingsResponse = await fetch('/api/rooms/my-bookings');
    const roomBookings = roomBookingsResponse.ok ? await roomBookingsResponse.json() : [];

    // Load facility bookings count
    const facilityBookingsResponse = await fetch('/api/facilities/my-bookings');
    const facilityBookings = facilityBookingsResponse.ok ? await facilityBookingsResponse.json() : [];

    // Calculate total bookings
    const totalBookings = roomBookings.length + facilityBookings.length;
    document.getElementById('totalBookings').textContent = totalBookings;

    // Load orders count
    const ordersResponse = await fetch('/api/food/my-orders');
    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      document.getElementById('totalOrders').textContent = orders.length;
    }

    // Load user profile for member since date
    const profileResponse = await fetch('/api/auth/profile');
    if (profileResponse.ok) {
      const user = await profileResponse.json();
      if (user.createdAt) {
        const createdDate = new Date(user.createdAt);
        const today = new Date();
        const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        document.getElementById('memberSince').textContent = daysDiff;
      }
    }

    // Calculate loyalty points (simplified - 10 points per booking/order)
    const ordersCount = parseInt(document.getElementById('totalOrders').textContent) || 0;
    const loyaltyPoints = (totalBookings + ordersCount) * 10;
    document.getElementById('loyaltyPoints').textContent = loyaltyPoints;

  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Load recent activity
async function loadRecentActivity() {
  try {
    const activityContainer = document.getElementById('recentActivity');
    let activities = [];

    // Get recent room bookings
    const roomBookingsResponse = await fetch('/api/rooms/my-bookings?limit=3');
    if (roomBookingsResponse.ok) {
      const roomBookings = await roomBookingsResponse.json();
      roomBookings.forEach(booking => {
        activities.push({
          type: 'booking',
          title: `Room booking for ${booking.room?.type || 'Room'}`,
          date: new Date(booking.createdAt || Date.now()),
          status: booking.status,
          icon: 'fas fa-bed'
        });
      });
    }

    // Get recent facility bookings
    const facilityBookingsResponse = await fetch('/api/facilities/my-bookings?limit=3');
    if (facilityBookingsResponse.ok) {
      const facilityBookings = await facilityBookingsResponse.json();
      facilityBookings.forEach(booking => {
        activities.push({
          type: 'booking',
          title: `Facility booking for ${booking.facility?.name || 'Facility'}`,
          date: new Date(booking.createdAt || Date.now()),
          status: booking.status,
          icon: 'fas fa-spa'
        });
      });
    }

    // Get recent orders
    const ordersResponse = await fetch('/api/food/my-orders?limit=3');
    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      orders.forEach(order => {
        activities.push({
          type: 'order',
          title: `Food order #${order._id?.slice(-6) || 'N/A'}`,
          date: new Date(order.createdAt || Date.now()),
          status: order.status,
          icon: 'fas fa-utensils'
        });
      });
    }

    // Sort by date (most recent first)
    activities.sort((a, b) => b.date - a.date);
    activities = activities.slice(0, 5); // Show only 5 most recent

    if (activities.length === 0) {
      activityContainer.innerHTML = `
        <div class="text-center py-4">
          <i class="fas fa-calendar-alt fa-2x text-muted mb-3"></i>
          <p class="text-muted">No recent activity</p>
          <small class="text-muted">Your bookings and orders will appear here</small>
        </div>
      `;
      return;
    }

    let html = '';
    activities.forEach(activity => {
      const timeAgo = getTimeAgo(activity.date);
      const statusColor = getStatusColor(activity.status);

      html += `
        <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
          <div class="flex-shrink-0">
            <div class="bg-light rounded-circle p-2">
              <i class="${activity.icon} text-${activity.type === 'booking' ? 'primary' : 'success'}"></i>
            </div>
          </div>
          <div class="flex-grow-1 ms-3">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">${activity.title}</h6>
                <small class="text-muted">${timeAgo}</small>
              </div>
              <span class="badge bg-${statusColor}">${activity.status || 'Active'}</span>
            </div>
          </div>
        </div>
      `;
    });

    activityContainer.innerHTML = html;

  } catch (error) {
    console.error('Error loading recent activity:', error);
    document.getElementById('recentActivity').innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
        <p class="text-muted">Unable to load recent activity</p>
      </div>
    `;
  }
}

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

// Helper function to get status color
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
}

// Logout
document.getElementById('logout').addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/';
  }
});

// Show rooms
async function showRooms() {
  try {
    const response = await fetch('/api/rooms');
    const rooms = await response.json();
    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="fas fa-bed me-2 text-primary"></i>Available Rooms
        </h3>
        <button class="btn btn-outline-secondary" onclick="showDashboard()">
          <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
        </button>
      </div>
      <div class="row">
    `;

    rooms.forEach(room => {
      html += `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${room.image || '/images/room.jpg'}" class="card-img-top" alt="${room.type}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${room.type}</h5>
              <p class="card-text flex-grow-1">${room.amenities?.join(', ') || 'Comfortable accommodation'}</p>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="h5 text-primary mb-0">₹${room.price?.toLocaleString() || 'N/A'}/night</span>
                <small class="text-muted">Up to ${room.capacity || 2} guests</small>
              </div>
              <button class="btn btn-primary w-100" onclick="bookRoom('${room._id}')">
                <i class="fas fa-calendar-plus me-1"></i>Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    document.getElementById('content').innerHTML = html;
  } catch (error) {
    console.error('Error loading rooms:', error);
    document.getElementById('content').innerHTML = '<div class="alert alert-danger">Error loading rooms. Please try again.</div>';
  }
}

// Book room (enhanced)
function bookRoom(roomId) {
  // You could implement a modal here instead of prompts
  const checkIn = prompt('Check-in date (YYYY-MM-DD)');
  const checkOut = prompt('Check-out date (YYYY-MM-DD)');
  const guests = prompt('Number of guests');

  if (!checkIn || !checkOut || !guests) {
    alert('Please fill in all details');
    return;
  }

  fetch('/api/rooms/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, checkIn, checkOut, guests: parseInt(guests) })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || 'Booking successful!');
    loadDashboardStats(); // Refresh stats
    loadRecentActivity(); // Refresh activity
  })
  .catch(error => {
    console.error('Booking error:', error);
    alert('Error making booking. Please try again.');
  });
}

// Show menu with enhanced filters
async function showMenu() {
  try {
    const categories = await fetch('/api/food/categories').then(res => res.json()).catch(() => []);

    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="fas fa-utensils me-2 text-danger"></i>Our Menu
        </h3>
        <button class="btn btn-outline-secondary" onclick="showDashboard()">
          <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
        </button>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Category</label>
              <select id="categoryFilter" class="form-select">
                <option value="">All Categories</option>
                ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Search</label>
              <input type="text" id="searchFilter" class="form-control" placeholder="Search dishes...">
            </div>
            <div class="col-md-3">
              <label class="form-label">Filters</label>
              <div class="d-flex gap-2">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="vegFilter">
                  <label class="form-check-label" for="vegFilter">
                    <i class="fas fa-leaf text-success me-1"></i>Veg
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="spicyFilter">
                  <label class="form-check-label" for="spicyFilter">
                    <i class="fas fa-fire text-danger me-1"></i>Spicy
                  </label>
                </div>
              </div>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-primary w-100" onclick="filterMenu()">
                <i class="fas fa-search me-1"></i>Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="menuItems" class="row"></div>
      <div id="cart" class="card mt-4 d-none">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-shopping-cart me-2"></i>Your Cart
          </h5>
        </div>
        <div class="card-body">
          <ul id="cartList" class="list-group list-group-flush mb-3"></ul>
          <button class="btn btn-success w-100" onclick="placeOrder()">
            <i class="fas fa-credit-card me-1"></i>Place Order
          </button>
        </div>
      </div>
    `;

    document.getElementById('content').innerHTML = html;
    filterMenu();
  } catch (error) {
    console.error('Error showing menu:', error);
    document.getElementById('content').innerHTML = '<div class="alert alert-danger">Error loading menu. Please try again.</div>';
  }
}

async function filterMenu() {
  try {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchFilter').value;
    const vegetarian = document.getElementById('vegFilter').checked;
    const spicy = document.getElementById('spicyFilter').checked;

    const params = new URLSearchParams({
      category: category || '',
      search: search || '',
      vegetarian: vegetarian.toString(),
      spicy: spicy.toString()
    });

    const response = await fetch(`/api/food?${params}`);
    const foods = await response.json();

    let html = '';
    if (foods.length === 0) {
      html = `
        <div class="col-12">
          <div class="text-center py-5">
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No dishes found</h5>
            <p class="text-muted">Try adjusting your filters</p>
          </div>
        </div>
      `;
    } else {
      foods.forEach(food => {
        html += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
              <img src="${food.image || '/images/food.jpg'}" class="card-img-top" alt="${food.name}" style="height: 180px; object-fit: cover;">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="card-title mb-0">${food.name}</h6>
                  <span class="badge bg-${food.category === 'Main Course' ? 'primary' : food.category === 'Appetizer' ? 'success' : food.category === 'Dessert' ? 'warning' : 'info'}">${food.category}</span>
                </div>
                <p class="card-text flex-grow-1 small">${food.description}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="h6 text-primary mb-0">₹${food.price?.toLocaleString() || 'N/A'}</span>
                  <div>
                    ${food.vegetarian ? '<i class="fas fa-leaf text-success me-1" title="Vegetarian"></i>' : ''}
                    ${food.spicy ? '<i class="fas fa-fire text-danger" title="Spicy"></i>' : ''}
                  </div>
                </div>
                <button class="btn btn-outline-primary w-100" onclick="addToCart('${food._id}', '${food.name}', ${food.price})">
                  <i class="fas fa-cart-plus me-1"></i>Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    document.getElementById('menuItems').innerHTML = html;
  } catch (error) {
    console.error('Error filtering menu:', error);
  }
}

let cart = [];
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.foodId === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ foodId: id, quantity: 1, name, price });
  }
  updateCart();
}

function updateCart() {
  const cartElement = document.getElementById('cart');
  const cartList = document.getElementById('cartList');

  if (cart.length === 0) {
    cartElement.classList.add('d-none');
    return;
  }

  cartElement.classList.remove('d-none');
  cartList.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.name}</strong>
          <br><small class="text-muted">₹${item.price} x ${item.quantity}</small>
        </div>
        <div class="d-flex align-items-center">
          <span class="me-3">₹${itemTotal.toLocaleString()}</span>
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </li>
    `;
  });

  // Add total
  cartList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <strong>Total</strong>
      <strong class="text-primary">₹${total.toLocaleString()}</strong>
    </li>
  `;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function placeOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  fetch('/api/food/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || 'Order placed successfully!');
    cart = [];
    updateCart();
    loadDashboardStats(); // Refresh stats
    loadRecentActivity(); // Refresh activity
  })
  .catch(error => {
    console.error('Order error:', error);
    alert('Error placing order. Please try again.');
  });
}

// Show facilities
async function showFacilities() {
  try {
    const response = await fetch('/api/facilities');
    const facilities = await response.json();

    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="fas fa-spa me-2 text-success"></i>Facilities & Services
        </h3>
        <button class="btn btn-outline-secondary" onclick="showDashboard()">
          <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
        </button>
      </div>
      <div class="row">
    `;

    facilities.forEach(facility => {
      html += `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${facility.image || '/images/swimming.jpg'}" class="card-img-top" alt="${facility.name}" style="height: 180px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${facility.name}</h5>
              <p class="card-text flex-grow-1">${facility.description}</p>
              <div class="mb-3">
                <small class="text-muted">
                  <i class="fas fa-calendar me-1"></i>${facility.availableDays?.join(', ') || 'Daily'}
                </small>
                <br>
                <small class="text-muted">
                  <i class="fas fa-clock me-1"></i>${facility.timeSlots?.join(', ') || '24/7'}
                </small>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="h6 text-success mb-0">₹${facility.price?.toLocaleString() || 'Free'}</span>
                <small class="text-muted">Capacity: ${facility.capacity || 'N/A'}</small>
              </div>
              <button class="btn btn-success w-100" onclick="bookFacility('${facility._id}')">
                <i class="fas fa-calendar-check me-1"></i>Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    document.getElementById('content').innerHTML = html;
  } catch (error) {
    console.error('Error loading facilities:', error);
    document.getElementById('content').innerHTML = '<div class="alert alert-danger">Error loading facilities. Please try again.</div>';
  }
}

// Book facility (enhanced)
function bookFacility(facilityId) {
  const date = prompt('Date (YYYY-MM-DD)');
  const timeSlot = prompt('Time slot (e.g., 10:00-11:00)');

  if (!date || !timeSlot) {
    alert('Please fill in all details');
    return;
  }

  fetch('/api/facilities/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facilityId, date, timeSlot })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || 'Booking successful!');
    loadDashboardStats(); // Refresh stats
    loadRecentActivity(); // Refresh activity
  })
  .catch(error => {
    console.error('Facility booking error:', error);
    alert('Error making booking. Please try again.');
  });
}

// Show my bookings
async function showMyBookings() {
  try {
    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="fas fa-calendar-check me-2 text-primary"></i>My Bookings
        </h3>
        <button class="btn btn-outline-secondary" onclick="showDashboard()">
          <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
        </button>
      </div>
    `;

    // Room bookings
    const roomBookingsResponse = await fetch('/api/rooms/my-bookings');
    if (roomBookingsResponse.ok) {
      const roomBookings = await roomBookingsResponse.json();
      html += '<h4 class="mb-3">Room Bookings</h4>';

      if (roomBookings.length === 0) {
        html += '<div class="alert alert-info">No room bookings found.</div>';
      } else {
        roomBookings.forEach(booking => {
          const statusColor = getStatusColor(booking.status);
          html += `
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="card-title">${booking.room?.type || 'Room'}</h5>
                    <p class="card-text mb-1">
                      <i class="fas fa-calendar me-1"></i>${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <p class="card-text mb-1">
                      <i class="fas fa-users me-1"></i>${booking.guests || 1} guest(s)
                    </p>
                  </div>
                  <span class="badge bg-${statusColor}">${booking.status || 'Pending'}</span>
                </div>
              </div>
            </div>
          `;
        });
      }
    }

    // Facility bookings
    const facilityBookingsResponse = await fetch('/api/facilities/my-bookings');
    if (facilityBookingsResponse.ok) {
      const facilityBookings = await facilityBookingsResponse.json();
      html += '<h4 class="mb-3 mt-4">Facility Bookings</h4>';

      if (facilityBookings.length === 0) {
        html += '<div class="alert alert-info">No facility bookings found.</div>';
      } else {
        facilityBookings.forEach(booking => {
          const statusColor = getStatusColor(booking.status);
          html += `
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="card-title">${booking.facility?.name || 'Facility'}</h5>
                    <p class="card-text mb-1">
                      <i class="fas fa-calendar me-1"></i>${new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p class="card-text mb-1">
                      <i class="fas fa-clock me-1"></i>${booking.timeSlot || 'N/A'}
                    </p>
                  </div>
                  <span class="badge bg-${statusColor}">${booking.status || 'Pending'}</span>
                </div>
              </div>
            </div>
          `;
        });
      }
    }

    document.getElementById('content').innerHTML = html;
  } catch (error) {
    console.error('Error loading bookings:', error);
    document.getElementById('content').innerHTML = '<div class="alert alert-danger">Error loading bookings. Please try again.</div>';
  }
}

// Show my orders
async function showMyOrders() {
  try {
    const response = await fetch('/api/food/my-orders');
    const orders = await response.json();

    let html = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="fas fa-shopping-cart me-2 text-success"></i>My Orders
        </h3>
        <button class="btn btn-outline-secondary" onclick="showDashboard()">
          <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
        </button>
      </div>
    `;

    if (orders.length === 0) {
      html += `
        <div class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No orders found</h5>
          <p class="text-muted">Your food orders will appear here</p>
        </div>
      `;
    } else {
      orders.forEach(order => {
        const statusColor = getStatusColor(order.status);
        const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString();

        html += `
          <div class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title">Order #${order._id?.slice(-8) || 'N/A'}</h5>
                  <p class="card-text mb-1">
                    <i class="fas fa-calendar me-1"></i>${orderDate}
                  </p>
                  <p class="card-text mb-1">
                    <i class="fas fa-utensils me-1"></i>${order.items?.length || 0} items
                  </p>
                </div>
                <div class="text-end">
                  <span class="badge bg-${statusColor} mb-2">${order.status || 'Pending'}</span>
                  <br>
                  <span class="h5 text-primary">₹${order.totalPrice?.toLocaleString() || '0'}</span>
                </div>
              </div>
              ${order.items ? `
                <div class="border-top pt-3">
                  <small class="text-muted">Items:</small>
                  <ul class="list-unstyled mb-0">
                    ${order.items.map(item => `
                      <li class="small">${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
    }

    document.getElementById('content').innerHTML = html;
  } catch (error) {
    console.error('Error loading orders:', error);
    document.getElementById('content').innerHTML = '<div class="alert alert-danger">Error loading orders. Please try again.</div>';
  }
}

// Show profile
function showProfile() {
  // This would typically load from an API
  const html = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">
        <i class="fas fa-user me-2 text-info"></i>My Profile
      </h3>
      <button class="btn btn-outline-secondary" onclick="showDashboard()">
        <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
      </button>
    </div>
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Profile Information</h5>
            <p class="text-muted">Profile management coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('content').innerHTML = html;
}

// Additional functions for new dashboard features
function showSettings() {
  const html = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">
        <i class="fas fa-cog me-2 text-secondary"></i>Settings
      </h3>
      <button class="btn btn-outline-secondary" onclick="showDashboard()">
        <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
      </button>
    </div>
    <div class="alert alert-info">
      <i class="fas fa-info-circle me-2"></i>Settings panel coming soon...
    </div>
  `;
  document.getElementById('content').innerHTML = html;
}

function showSupport() {
  const html = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">
        <i class="fas fa-headset me-2 text-warning"></i>Support
      </h3>
      <button class="btn btn-outline-secondary" onclick="showDashboard()">
        <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
      </button>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <i class="fas fa-phone fa-3x text-primary mb-3"></i>
            <h5>Call Us</h5>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <i class="fas fa-envelope fa-3x text-success mb-3"></i>
            <h5>Email Us</h5>
            <p>support@chateauluxe.com</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('content').innerHTML = html;
}

function showDashboard() {
  document.getElementById('content').innerHTML = '';
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global test functions for debugging
window.testNavigation = function() {
  console.log('Testing navigation functions...');
  console.log('showRooms available:', typeof showRooms);
  console.log('showMenu available:', typeof showMenu);
  console.log('showFacilities available:', typeof showFacilities);
  
  // Test if elements exist
  console.log('rooms-nav element:', document.getElementById('rooms-nav'));
  console.log('menu-nav element:', document.getElementById('menu-nav'));
  console.log('facilities-nav element:', document.getElementById('facilities-nav'));
};