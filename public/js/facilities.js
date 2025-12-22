// Load facilities on page load
document.addEventListener('DOMContentLoaded', loadFacilities);

async function loadFacilities() {
  try {
    const response = await fetch('/api/facilities');
    const facilities = await response.json();
    const container = document.getElementById('facilitiesContainer');
    container.innerHTML = facilities.map(facility => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="facility-card" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; position: relative; height: 100%;">
          <div style="position: relative; overflow: hidden; height: 200px;">
            <img src="${facility.image || '/images/swimming.jpg'}" alt="${facility.name}" style="width: 100%; height: 100%; object-fit: cover; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%); opacity: 0; transition: opacity 0.3s ease;"></div>
          </div>
          <div style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <h5 style="font-size: 1.25rem; font-weight: 700; color: #2d3748; margin-bottom: 0.5rem;">${facility.name}</h5>
              <span style="display: inline-block; background: rgba(245, 87, 108, 0.1); color: #f5576c; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${facility.price > 0 ? '₹' + facility.price : 'Free'}</span>
            </div>
            <p style="color: #718096; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5;">${facility.description}</p>
            <div style="margin-bottom: 1rem;">
              <small style="color: #a0aec0;"><i class="fas fa-users me-1"></i>Capacity: ${facility.capacity}</small><br>
              <small style="color: #a0aec0;"><i class="fas fa-calendar me-1"></i>${facility.availableDays.slice(0, 3).join(', ')}${facility.availableDays.length > 3 ? '...' : ''}</small>
            </div>
            <button class="btn" onclick="openFacilityBookingModal('${facility._id}', '${facility.name}', ${facility.price}, '${facility.image || '/images/swimming.jpg'}')" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 25px; padding: 0.75rem 1.5rem; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; width: 100%;">
              <i class="fas fa-calendar-plus me-2"></i>Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading facilities:', error);
  }
}

let selectedFacilityData;
async function openFacilityBookingModal(facilityId, facilityName, facilityPrice, facilityImage) {
  selectedFacilityData = { id: facilityId, name: facilityName, price: facilityPrice, image: facilityImage };
  document.querySelector('#facilityBookingModal .modal-title').textContent = `Add ${facilityName} to Cart`;
  // Load available slots for today (or selected date)
  const date = new Date().toISOString().split('T')[0];
  document.getElementById('facilityDate').value = date;
  await loadTimeSlots(date);
  new bootstrap.Modal(document.getElementById('facilityBookingModal')).show();
}

async function loadTimeSlots(date) {
  try {
    const response = await fetch(`/api/facilities/${selectedFacilityData.id}/slots?date=${date}`);
    const data = await response.json();
    const select = document.getElementById('timeSlot');
    select.innerHTML = '';
    data.availableSlots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading time slots:', error);
  }
}

document.getElementById('facilityDate').addEventListener('change', (e) => {
  loadTimeSlots(e.target.value);
});

document.getElementById('facilityBookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const date = document.getElementById('facilityDate').value;
  const timeSlot = document.getElementById('timeSlot').value;

  // Add to cart
  const cartItem = {
    id: selectedFacilityData.id,
    type: 'facility',
    name: selectedFacilityData.name,
    price: selectedFacilityData.price,
    image: selectedFacilityData.image,
    quantity: 1,
    details: {
      date: date,
      timeSlot: timeSlot
    }
  };

  // Add to cart using the global cart function
  if (typeof addToCart === 'function') {
    addToCart(cartItem);
    bootstrap.Modal.getInstance(document.getElementById('facilityBookingModal')).hide();

    // Reset form
    document.getElementById('facilityBookingForm').reset();
  } else {
    alert('Cart functionality not available. Please refresh the page.');
  }
});