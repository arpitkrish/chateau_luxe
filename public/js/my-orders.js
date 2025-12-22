// Load orders on page load
document.addEventListener('DOMContentLoaded', loadOrders);

async function loadOrders() {
  try {
    const response = await fetch('/api/food/my-orders');
    const orders = await response.json();

    // Update stats
    updateOrderStats(orders);

    // Load all orders
    loadAllOrders(orders);

    // Load active orders
    loadActiveOrders(orders);

    // Load completed orders
    loadCompletedOrders(orders);

  } catch (error) {
    console.error('Error loading orders:', error);
    showOrderError('Failed to load orders. Please try again.');
  }
}

function updateOrderStats(orders) {
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length;
  const totalSpent = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('deliveredOrders').textContent = deliveredOrders;
  document.getElementById('pendingOrders').textContent = activeOrders;
  document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString()}`;
}

function loadAllOrders(orders) {
  const container = document.getElementById('allOrdersContainer');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-shopping-cart"></i>
        <h3>No Orders Found</h3>
        <p>You haven't placed any orders yet. Start your culinary journey today!</p>
        <a href="/food" class="btn btn-primary">Browse Menu</a>
      </div>
    `;
    return;
  }

  let html = '';
  orders.forEach(order => {
    const statusClass = getOrderStatusClass(order.status);
    html += createOrderCard(order, statusClass);
  });

  container.innerHTML = html;
}

function loadActiveOrders(orders) {
  const container = document.getElementById('activeOrdersContainer');
  if (!container) return;

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));

  if (activeOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clock"></i>
        <h3>No Active Orders</h3>
        <p>Your current orders will appear here. Start your culinary journey!</p>
        <a href="/food" class="btn btn-primary">Order Now</a>
      </div>
    `;
    return;
  }

  let html = '';
  activeOrders.forEach(order => {
    const statusClass = getOrderStatusClass(order.status);
    html += createOrderCard(order, statusClass);
  });

  container.innerHTML = html;
}

function loadCompletedOrders(orders) {
  const container = document.getElementById('completedOrdersContainer');
  if (!container) return;

  const completedOrders = orders.filter(o => o.status === 'delivered');

  if (completedOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <h3>No Completed Orders</h3>
        <p>Your order history will be displayed here once you place your first order.</p>
        <a href="/food" class="btn btn-primary">Browse Menu</a>
      </div>
    `;
    return;
  }

  let html = '';
  completedOrders.forEach(order => {
    const statusClass = getOrderStatusClass(order.status);
    html += createOrderCard(order, statusClass);
  });

  container.innerHTML = html;
}

function createOrderCard(order, statusClass) {
  const orderItems = order.items || [];
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return `
    <div class="order-card">
      <div class="order-status status-${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
      <div class="order-header">
        <div class="order-title"><i class="fas fa-receipt me-2"></i>Order #${order._id?.slice(-8) || 'N/A'}</div>
        <div class="order-meta">
          <span><i class="fas fa-calendar-alt"></i> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
          <span><i class="fas fa-clock"></i> ${new Date(order.createdAt || Date.now()).toLocaleTimeString()}</span>
        </div>
      </div>
      <div class="order-body">
        <div class="order-items">
          ${orderItems.map(item => `
            <div class="order-item">
              <div class="item-info">
                <div class="item-image" style="background-image: url('${item.food?.image || '/images/default-food.jpg'}')"></div>
                <div class="item-details">
                  <h6>${item.food?.name || 'Unknown Item'}</h6>
                  <small>${item.food?.category || 'Food'}</small>
                </div>
              </div>
              <div class="item-quantity">x${item.quantity}</div>
              <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
            </div>
          `).join('')}
        </div>
        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹${subtotal.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Tax (18%):</span>
            <span>₹${tax.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span><strong>Total:</strong></span>
            <span><strong>₹${total.toFixed(2)}</strong></span>
          </div>
        </div>
        <div class="order-actions">
          <button class="btn btn-primary btn-action" onclick="viewOrderDetails('${order._id}')">
            <i class="fas fa-eye me-1"></i>View Details
          </button>
          ${order.status === 'delivered' ? `
            <button class="btn btn-outline-info btn-action" onclick="reorderItems('${order._id}')">
              <i class="fas fa-redo me-1"></i>Reorder
            </button>
          ` : order.status === 'pending' ? `
            <button class="btn btn-outline-danger btn-action" onclick="cancelOrder('${order._id}')">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function getOrderStatusClass(status) {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'delivered';
    case 'preparing': return 'preparing';
    case 'ready': return 'preparing';
    case 'pending': return 'pending';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
}

function viewOrderDetails(orderId) {
  // TODO: Implement order details modal
  showToast('Order details feature coming soon!', 'info');
}

function reorderItems(orderId) {
  // TODO: Implement reorder functionality
  showToast('Reorder feature coming soon!', 'info');
}

function cancelOrder(orderId) {
  if (confirm('Are you sure you want to cancel this order?')) {
    // TODO: Implement order cancellation
    showToast('Order cancellation feature coming soon!', 'warning');
  }
}

function showOrderError(message) {
  const container = document.getElementById('allOrdersContainer');
  if (container) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Orders</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="loadOrders()">Try Again</button>
      </div>
    `;
  }
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

// Logout
document.getElementById('logout')?.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
});