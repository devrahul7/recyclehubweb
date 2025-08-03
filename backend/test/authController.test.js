import jwt from 'jsonwebtoken';
import { register, login, getProfile } from '../controllers/authController.js';
import User from '../models/User.js';

jest.mock('jsonwebtoken');
jest.mock('../models/User.js');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create user successfully', async () => {
      req.body = { name: 'John', email: 'john@test.com', password: 'password' };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@test.com', role: 'user' });
      jwt.sign.mockReturnValue('fake-token');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        token: 'fake-token',
        user: { id: 1, name: 'John', email: 'john@test.com', role: 'user' }
      });
    });

    it('should return error if user exists', async () => {
      req.body = { email: 'existing@test.com' };
      User.findOne.mockResolvedValue({ id: 1 });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      req.body = { email: 'john@test.com', password: 'password' };
      const mockUser = {
        id: 1, name: 'John', email: 'john@test.com', role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('fake-token');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'fake-token',
        user: { id: 1, name: 'John', email: 'john@test.com', role: 'user' }
      });
    });

    it('should return error for invalid credentials', async () => {
      req.body = { email: 'wrong@test.com', password: 'password' };
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});