const User = require('../models/User');

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.createdAt).toBeDefined();
    });

    test('should hash password before saving', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      // Password should be hashed, not plain text
      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(userData.password.length);
    });

    test('should default role to "user"', async () => {
      const userData = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      expect(user.role).toBe('user');
    });

    test('should require name, email, and password', async () => {
      const user = new User({});
      let error;

      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('should enforce unique email', async () => {
      const userData1 = {
        name: 'User One',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      const userData2 = {
        name: 'User Two',
        email: 'duplicate@example.com',
        password: 'password456'
      };

      await new User(userData1).save();

      let error;
      try {
        await new User(userData2).save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('Password Methods', () => {
    test('should compare password correctly', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'correctpassword'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.comparePassword('correctpassword');
      const isNotMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });
});