import { getUserDashboard, updateProfile } from '../controllers/userController.js';
import User from '../models/User.js';
import Item from '../models/Item.js';

jest.mock('../models/User.js');
jest.mock('../models/Item.js');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getUserDashboard', () => {
    it('should return user dashboard data', async () => {
      Item.count
        .mockResolvedValueOnce(10) // totalItems
        .mockResolvedValueOnce(3)  // pendingItems
        .mockResolvedValueOnce(5)  // approvedItems
        .mockResolvedValueOnce(2); // rejectedItems
      
      Item.findAll.mockResolvedValue([
        { id: 1, name: 'Item 1', status: 'pending' }
      ]);

      await getUserDashboard(req, res);

      expect(res.json).toHaveBeenCalledWith({
        stats: {
          totalItems: 10,
          pendingItems: 3,
          approvedItems: 5,
          rejectedItems: 2
        },
        recentItems: [{ id: 1, name: 'Item 1', status: 'pending' }]
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      req.body = { name: 'Updated Name', phone: '123456789', address: 'New Address' };
      const mockUser = {
        id: 1, name: 'Updated Name', email: 'user@test.com',
        phone: '123456789', address: 'New Address', role: 'user',
        update: jest.fn()
      };
      User.findByPk.mockResolvedValue(mockUser);

      await updateProfile(req, res);

      expect(mockUser.update).toHaveBeenCalledWith({
        name: 'Updated Name',
        phone: '123456789',
        address: 'New Address'
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: mockUser
      });
    });
  });
});