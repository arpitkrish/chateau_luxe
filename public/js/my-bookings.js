// Load bookings on page load
document.addEventListener('DOMContentLoaded', loadBookings);

async function loadBookings() {
  try {
    const [roomResponse, facilityResponse] = await Promise.all([
      fetch('/api/rooms/my-bookings', { credentials: 'include' }),
      fetch('/api/facilities/my-bookings', { credentials: 'include' })
    ]);

    const roomBookings = await roomResponse.json();
    const facilityBookings = await facilityResponse.json();

    // Update stats
    updateStats(roomBookings, facilityBookings);

    // Load all bookings
    loadAllBookings(roomBookings, facilityBookings);

    // Load room bookings
    loadRoomBookings(roomBookings);

    // Load facility bookings
    loadFacilityBookings(facilityBookings);

  } catch (error) {
    console.error('Error loading bookings:', error);
    showError('Failed to load bookings. Please try again.');
  }
}

function updateStats(roomBookings, facilityBookings) {
  const totalBookings = roomBookings.length + facilityBookings.length;
  const confirmedBookings = [...roomBookings, ...facilityBookings].filter(b => b.status === 'confirmed').length;
  const pendingBookings = [...roomBookings, ...facilityBookings].filter(b => b.status === 'pending').length;
  const totalSpent = [...roomBookings, ...facilityBookings]
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  document.getElementById('totalBookings').textContent = totalBookings;
  document.getElementById('confirmedBookings').textContent = confirmedBookings;
  document.getElementById('pendingBookings').textContent = pendingBookings;
  document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString()}`;
}

function loadAllBookings(roomBookings, facilityBookings) {
  const container = document.getElementById('allBookingsContainer');
  if (!container) return;

  if (roomBookings.length === 0 && facilityBookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-times"></i>
        <h3>No Bookings Found</h3>
        <p>You haven't made any bookings yet. Start your luxury experience today!</p>
        <div class="d-flex gap-2 justify-content-center">
          <a href="/rooms" class="btn btn-primary">Book a Room</a>
          <a href="/facilities" class="btn btn-outline-primary">Book Facilities</a>
        </div>
      </div>
    `;
    return;
  }

  let html = '';

  if (roomBookings.length > 0) {
    html += '<h4 class="mb-3"><i class="fas fa-bed me-2"></i>Room Bookings</h4>';
    roomBookings.forEach(booking => {
      const statusClass = getStatusClass(booking.status);
      html += `
        <div class="booking-card">
          <div class="booking-status status-${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
          <div class="booking-header">
            <div class="booking-title"><i class="fas fa-hotel me-2"></i>${booking.room?.type || 'Room'} Booking</div>
            <div class="booking-meta">
              <span><i class="fas fa-calendar-alt"></i> ${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}</span>
              <span><i class="fas fa-users"></i> ${booking.guests} Guest${booking.guests > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div class="booking-body">
            <div class="booking-details">
              <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <div class="label">Room Type</div>
                  <div class="value">${booking.room?.type || 'N/A'}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar-check"></i>
                <div>
                  <div class="label">Check-in</div>
                  <div class="value">${new Date(booking.checkIn).toLocaleDateString()}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar-times"></i>
                <div>
                  <div class="label">Check-out</div>
                  <div class="value">${new Date(booking.checkOut).toLocaleDateString()}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-rupee-sign"></i>
                <div>
                  <div class="label">Total Amount</div>
                  <div class="value">₹${booking.totalPrice?.toLocaleString() || '0'}</div>
                </div>
              </div>
            </div>
            <div class="booking-actions">
              <button class="btn btn-primary btn-action" onclick="viewBookingDetails('${booking._id}', 'room')">
                <i class="fas fa-eye me-1"></i>View Details
              </button>
              ${booking.status === 'confirmed' ? `
                <button class="btn btn-outline-danger btn-action" onclick="cancelBooking('${booking._id}', 'room')">
                  <i class="fas fa-times me-1"></i>Cancel
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });
  }

  if (facilityBookings.length > 0) {
    html += '<h4 class="mb-3 mt-4"><i class="fas fa-spa me-2"></i>Facility Bookings</h4>';
    facilityBookings.forEach(booking => {
      const statusClass = getStatusClass(booking.status);
      html += `
        <div class="booking-card">
          <div class="booking-status status-${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
          <div class="booking-header">
            <div class="booking-title"><i class="fas fa-spa me-2"></i>${booking.facility?.name || 'Facility'} Booking</div>
            <div class="booking-meta">
              <span><i class="fas fa-calendar-alt"></i> ${new Date(booking.date).toLocaleDateString()}</span>
              <span><i class="fas fa-clock"></i> ${booking.timeSlot}</span>
            </div>
          </div>
          <div class="booking-body">
            <div class="booking-details">
              <div class="detail-item">
                <i class="fas fa-concierge-bell"></i>
                <div>
                  <div class="label">Facility</div>
                  <div class="value">${booking.facility?.name || 'N/A'}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar-day"></i>
                <div>
                  <div class="label">Date</div>
                  <div class="value">${new Date(booking.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <div>
                  <div class="label">Time Slot</div>
                  <div class="value">${booking.timeSlot}</div>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-users"></i>
                <div>
                  <div class="label">Guests</div>
                  <div class="value">${booking.guests || 1}</div>
                </div>
              </div>
            </div>
            <div class="booking-actions">
              <button class="btn btn-primary btn-action" onclick="viewBookingDetails('${booking._id}', 'facility')">
                <i class="fas fa-eye me-1"></i>View Details
              </button>
              ${booking.status === 'confirmed' ? `
                <button class="btn btn-outline-danger btn-action" onclick="cancelBooking('${booking._id}', 'facility')">
                  <i class="fas fa-times me-1"></i>Cancel
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

function loadRoomBookings(roomBookings) {
  const container = document.getElementById('roomBookingsContainer');
  if (!container) return;

  if (roomBookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-bed"></i>
        <h3>No Room Bookings</h3>
        <p>You haven't booked any rooms yet. Start your luxury experience today!</p>
        <a href="/rooms" class="btn btn-primary">Browse Rooms</a>
      </div>
    `;
    return;
  }

  let html = '';
  roomBookings.forEach(booking => {
    const statusClass = getStatusClass(booking.status);
    html += `
      <div class="booking-card">
        <div class="booking-status status-${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
        <div class="booking-header">
          <div class="booking-title"><i class="fas fa-hotel me-2"></i>${booking.room?.type || 'Room'} Booking</div>
          <div class="booking-meta">
            <span><i class="fas fa-calendar-alt"></i> ${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}</span>
            <span><i class="fas fa-users"></i> ${booking.guests} Guest${booking.guests > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="booking-body">
          <div class="booking-details">
            <div class="detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <div class="label">Room Type</div>
                <div class="value">${booking.room?.type || 'N/A'}</div>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-calendar-check"></i>
              <div>
                <div class="label">Check-in</div>
                <div class="value">${new Date(booking.checkIn).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-calendar-times"></i>
              <div>
                <div class="label">Check-out</div>
                <div class="value">${new Date(booking.checkOut).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-rupee-sign"></i>
              <div>
                <div class="label">Total Amount</div>
                <div class="value">₹${booking.totalPrice?.toLocaleString() || '0'}</div>
              </div>
            </div>
          </div>
          <div class="booking-actions">
            <button class="btn btn-primary btn-action" onclick="viewBookingDetails('${booking._id}', 'room')">
              <i class="fas fa-eye me-1"></i>View Details
            </button>
            ${booking.status === 'confirmed' ? `
              <button class="btn btn-outline-danger btn-action" onclick="cancelBooking('${booking._id}', 'facility')">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function loadFacilityBookings(facilityBookings) {
  const container = document.getElementById('facilityBookingsContainer');
  if (!container) return;

  if (facilityBookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-spa"></i>
        <h3>No Facility Bookings</h3>
        <p>Enhance your stay with our premium facilities and services.</p>
        <a href="/facilities" class="btn btn-primary">Explore Facilities</a>
      </div>
    `;
    return;
  }

  let html = '';
  facilityBookings.forEach(booking => {
    const statusClass = getStatusClass(booking.status);
    html += `
      <div class="booking-card">
        <div class="booking-status status-${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
        <div class="booking-header">
          <div class="booking-title"><i class="fas fa-spa me-2"></i>${booking.facility?.name || 'Facility'} Booking</div>
          <div class="booking-meta">
            <span><i class="fas fa-calendar-alt"></i> ${new Date(booking.date).toLocaleDateString()}</span>
            <span><i class="fas fa-clock"></i> ${booking.timeSlot}</span>
          </div>
        </div>
        <div class="booking-body">
          <div class="booking-details">
            <div class="detail-item">
              <i class="fas fa-concierge-bell"></i>
              <div>
                <div class="label">Facility</div>
                <div class="value">${booking.facility?.name || 'N/A'}</div>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-calendar-day"></i>
              <div>
                <div class="label">Date</div>
                <div class="value">${new Date(booking.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <div>
                <div class="label">Time Slot</div>
                <div class="value">${booking.timeSlot}</div>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <div>
                <div class="label">Guests</div>
                <div class="value">${booking.guests || 1}</div>
              </div>
            </div>
          </div>
          <div class="booking-actions">
            <button class="btn btn-primary btn-action" onclick="viewBookingDetails('${booking._id}', 'facility')">
              <i class="fas fa-eye me-1"></i>View Details
            </button>
            ${booking.status === 'confirmed' ? `
              <button class="btn btn-outline-danger btn-action" onclick="cancelBooking('${booking._id}', 'facility')">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case 'confirmed': return 'confirmed';
    case 'pending': return 'pending';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
}

function viewBookingDetails(bookingId, type) {
  // TODO: Implement booking details modal
  showToast('Booking details feature coming soon!', 'info');
}

function cancelBooking(bookingId, type) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    // TODO: Implement booking cancellation
    showToast('Booking cancellation feature coming soon!', 'warning');
  }
}

function showError(message) {
  const container = document.getElementById('allBookingsContainer');
  if (container) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Bookings</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="loadBookings()">Try Again</button>
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
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/';
});