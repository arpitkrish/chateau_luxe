# Chateau Luxe Hotel Management System

A full-stack Node.js application for hotel management in Chandigarh, India, covering backend engineering syllabus topics.

## Features

- User registration and authentication with JWT
- Room booking system with 6 luxurious rooms (prices in INR)
- Indian cuisine menu with 10 authentic dishes, cart functionality
- Facility booking with availability checks and time slots
- Secure payment gateway integration with Razorpay (Card payments)
- Dashboard with navigation, profile dropdown, my bookings/orders
- Responsive design with Bootstrap and custom CSS
- MongoDB database with advanced schemas
- Error handling, async programming, file handling utilities
- RESTful APIs with Express.js, routing, middleware, EJS templating

## Payment Integration

- **Razorpay Payment Gateway**: Secure card payments for all bookings and orders
- **JWT Authentication**: Protected payment routes and user verification
- **Payment Verification**: Server-side payment verification for security
- **Payment Status Tracking**: Track payment status for all transactions

## Setup Instructions

1. Get Razorpay API keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Update `.env` file with your Razorpay keys:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   ```
3. Run `npm install` to install Razorpay SDK
4. Follow the regular setup instructions

## Enhanced Features

- **Indian Cuisine**: Authentic dishes like Butter Chicken, Biryani, Paneer Tikka, Ras Malai
- **Facilities**: Swimming Pool, Gym, Spa, Conference Room, Parking (prices in INR)
- **Navigation**: Expanded header with logo, user profile, multiple sections
- **Location**: Based in Chandigarh, Punjab, India
- **Images**: Multiple image placeholders for rooms, food, facilities, etc.

## Syllabus Coverage

- Node.js basics, CommonJS modules, npm packages
- Error handling, async programming, file handling
- Express.js, routing, middleware, EJS
- Authentication with JWT
- MongoDB integration with advanced queries

## Installation

1. Clone the repository
2. Run `npm install`
3. Set up MongoDB and update `.env` with your MONGO_URI
4. Run `npm start` or `npm run dev`

## Usage

- Visit `http://localhost:3000` for the home page with sections for rooms, dining, facilities
- Register/Login to access dashboard
- Book rooms (₹8,000 - ₹40,000/night), filter and order Indian food with cart, book facilities
- View my bookings and orders in dashboard

## Images

Add images to `public/images/` folder:
- logo.png, footer-logo.png
- hotel.jpg, room.jpg, food.jpg, swimming.jpg
- deluxe-room.jpg, suite.jpg, standard-room.jpg, executive-suite.jpg, presidential-suite.jpg, family-suite.jpg
- butter-chicken.jpg, paneer-tikka.jpg, biryani.jpg, ras-malai.jpg, masala-chai.jpg, palak-paneer.jpg, chicken-65.jpg, gulab-jamun.jpg, aloo-gobi.jpg, lassi.jpg
- restaurant.jpg, bar.jpg
- parking.jpg, gym.jpg, spa.jpg, conference.jpg
- room-icon.jpg, food-icon.jpg, facility-icon.jpg
- user-avatar.png
- And more placeholders as needed

## Technologies

- Node.js, Express.js, MongoDB, EJS, Bootstrap, JWT, bcryptjs
- Location: Chandigarh, Punjab, India
- Currency: Indian Rupees (INR)
