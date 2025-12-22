const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Room = require('../models/Room');
const Food = require('../models/Food');
const { Facility } = require('../models/Facility');

describe('API Integration Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // App is already connected via setup.js
  });

  beforeEach(async () => {
    // Create test user for each test
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();

    // Create test data
    const testRoom = new Room({
      type: 'Deluxe Room',
      price: 8000,
      capacity: 2,
      amenities: ['WiFi', 'AC'],
      available: true,
      image: 'room1.jpg'
    });
    await testRoom.save();

    const testFood = new Food({
      name: 'Butter Chicken',
      description: 'Creamy chicken curry',
      price: 250,
      category: 'main',
      available: true,
      image: 'butter-chicken.jpg'
    });
    await testFood.save();

    const testFacility = new Facility({
      name: 'Swimming Pool',
      description: 'Olympic size pool',
      price: 500,
      capacity: 50,
      timeSlots: ['09:00-10:00', '10:00-11:00'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday']
    });
    await testFacility.save();

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup is handled by setup.js
  });

  describe('Authentication API', () => {
    test('POST /api/auth/register - should register new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.token).toBeDefined();
    });

    test('POST /api/auth/login - should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    test('POST /api/auth/login - should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Rooms API', () => {
    beforeAll(async () => {
      // Create test room
      const testRoom = new Room({
        name: 'Deluxe Room',
        type: 'deluxe',
        price: 8000,
        description: 'Luxury room with city view',
        amenities: ['WiFi', 'AC', 'TV'],
        images: ['room1.jpg'],
        capacity: 2,
        available: true
      });
      await testRoom.save();
    });

    test('GET /api/rooms - should return rooms list', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].type).toBeDefined();
      expect(response.body[0].price).toBeDefined();
    });

    test('GET /api/rooms/:id - should return specific room', async () => {
      const rooms = await Room.find();
      const roomId = rooms[0]._id;

      const response = await request(app)
        .get(`/api/rooms/${roomId}`);

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('Deluxe Room');
      expect(response.body.price).toBe(8000);
    });
  });

  describe('Food API', () => {
    beforeAll(async () => {
      // Create test food item
      const testFood = new Food({
        name: 'Butter Chicken',
        category: 'main',
        price: 250,
        description: 'Creamy butter chicken with naan',
        image: 'butter-chicken.jpg',
        available: true,
        ingredients: ['chicken', 'butter', 'cream', 'spices']
      });
      await testFood.save();
    });

    test('GET /api/food - should return food menu', async () => {
      const response = await request(app)
        .get('/api/food');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBeDefined();
      expect(response.body[0].price).toBeDefined();
    });

    test('GET /api/food?category=main - should filter by category', async () => {
      const response = await request(app)
        .get('/api/food?category=main');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should contain our test food
      const butterChicken = response.body.find(item => item.name === 'Butter Chicken');
      expect(butterChicken).toBeDefined();
      expect(butterChicken.category).toBe('main');
    });
  });

  describe('Facilities API', () => {
    beforeAll(async () => {
      // Create test facility
      const testFacility = new Facility({
        name: 'Swimming Pool',
        type: 'pool',
        price: 500,
        description: 'Olympic size swimming pool',
        image: 'pool.jpg',
        available: true,
        capacity: 50,
        openingHours: '6:00 AM - 10:00 PM'
      });
      await testFacility.save();
    });

    test('GET /api/facilities - should return facilities list', async () => {
      const response = await request(app)
        .get('/api/facilities');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBeDefined();
      expect(response.body[0].price).toBeDefined();
    });
  });

  describe('Protected Routes', () => {
    test('GET /api/auth/profile - should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
    });

    test('GET /api/auth/profile - should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.email).toBe('test@example.com');
    });
  });
});