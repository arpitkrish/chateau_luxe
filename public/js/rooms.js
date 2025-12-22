// Load rooms on page load
document.addEventListener('DOMContentLoaded', loadRooms);

async function loadRooms() {
  try {
    const response = await fetch('/api/rooms');
    const rooms = await response.json();
    const container = document.getElementById('roomsContainer');
    container.innerHTML = rooms.map(room => `
      <div class="col-lg-4 col-md-6 mb-4 stagger-animation">
        <div class="room-card" data-room-type="${room.type.toLowerCase().replace(' ', '-')}">
          <div class="room-image">
            <img src="${room.image || '/images/room.jpg'}" alt="${room.type}" loading="lazy">
            <div class="room-overlay"></div>
          </div>
          <div class="room-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="room-title">${room.type}</h5>
              <span class="room-price">₹${room.price.toLocaleString()}/night</span>
            </div>
            <p class="room-description">Capacity: ${room.capacity} guests</p>
            <div class="room-amenities mb-3">
              ${room.amenities.map(amenity => `<span class="amenity-badge">${amenity}</span>`).join('')}
            </div>
            <button class="btn-book" onclick="openBookingModal('${room._id}', '${room.type}', ${room.price}, '${room.image || '/images/room.jpg'}')">
              <i class="fas fa-calendar-plus me-2"></i>Book Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}

let selectedRoomData;
function openBookingModal(roomId, roomType, roomPrice, roomImage) {
  selectedRoomData = { id: roomId, type: roomType, price: roomPrice, image: roomImage };
  document.querySelector('#bookingModal .modal-title').textContent = `Add ${roomType} to Cart`;
  new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const checkIn = document.getElementById('checkIn').value;
  const checkOut = document.getElementById('checkOut').value;
  const guests = document.getElementById('guests').value;

  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    alert('Check-out date must be after check-in date');
    return;
  }

  // Calculate total price for the stay
  const totalPrice = selectedRoomData.price * nights;

  // Add to cart
  const cartItem = {
    id: selectedRoomData.id,
    type: 'room',
    name: selectedRoomData.type,
    price: totalPrice,
    image: selectedRoomData.image,
    quantity: 1,
    details: {
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      nights: nights,
      pricePerNight: selectedRoomData.price
    }
  };

  // Add to cart (using the global cart functions from index.ejs)
  if (typeof addToCart === 'function') {
    addToCart(cartItem);
    bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();

    // Reset form
    document.getElementById('bookingForm').reset();
  } else {
    alert('Cart functionality not available. Please refresh the page.');
  }
});