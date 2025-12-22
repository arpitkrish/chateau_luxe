# Testing Guide for Chateau Luxe Hotel Management System

This project includes comprehensive testing with both unit tests and integration tests.

## Test Types

### 1. Unit Testing
- Tests individual functions and models in isolation
- Uses Jest as the testing framework
- Located in `tests/` directory

### 2. Integration Testing
- Tests API endpoints and full request/response cycles
- Uses Supertest for HTTP endpoint testing
- Tests complete user workflows

## Prerequisites

Before running tests, ensure you have:
- Node.js installed
- MongoDB running
- Redis running (for session/cache testing)
- All dependencies installed: `npm install`

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (for development)
```bash
npm run test:watch
```

### Run Only Unit Tests
```bash
npm test -- --testPathPattern=unit
```

### Run Only Integration Tests
```bash
npm test -- --testPathPattern=integration
```

### Run Legacy API Tests
```bash
npm run test:integration
```

## Test Structure

```
tests/
├── setup.js                 # Test environment setup
├── User.test.js            # Unit tests for User model
├── api.integration.test.js # Integration tests for API endpoints
└── ...
```

## Test Coverage

Run tests with coverage report:
```bash
npm test -- --coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Writing Tests

### Unit Test Example
```javascript
const User = require('../models/User');

describe('User Model', () => {
  test('should create user with valid data', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const savedUser = await user.save();
    expect(savedUser.name).toBe('John Doe');
  });
});
```

### Integration Test Example
```javascript
const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  test('GET /api/rooms should return rooms', async () => {
    const response = await request(app).get('/api/rooms');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Test Environment

- **Database**: Uses a separate test database (`chateau_luxe_test`)
- **Port**: Tests run on port 3002 to avoid conflicts
- **Data**: Each test suite starts with a clean database
- **Authentication**: Tests include JWT token generation for protected routes

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
- No external dependencies required
- Fast execution (< 30 seconds)
- Comprehensive coverage of critical paths

## Troubleshooting

### Tests Failing Due to Database
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env` file
- Test database is automatically created/dropped

### Port Conflicts
- Tests use port 3002 by default
- Change port in test files if needed

### Authentication Issues
- JWT secret must be set in `.env`
- Test tokens are generated automatically

## Best Practices

1. **Write tests for new features** before implementation
2. **Keep tests fast** - mock external services when possible
3. **Test edge cases** - invalid inputs, error conditions
4. **Use descriptive test names** - explain what is being tested
5. **Maintain test coverage** above 80%

## Adding New Tests

1. Create test file in `tests/` directory
2. Follow naming convention: `*.test.js` or `*.spec.js`
3. Use `describe()` blocks to group related tests
4. Use `beforeAll()`, `afterAll()`, `beforeEach()`, `afterEach()` for setup/cleanup
5. Run `npm test` to verify tests pass