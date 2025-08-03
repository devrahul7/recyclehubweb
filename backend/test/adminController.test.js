import { getAllUsers, toggleUserStatus, deleteUser } from '../controllers/adminController.js';
import User from '../models/User.js';
import Item from '../models/Item.js';

jest.mock('../models/User.js');
jest.mock('../models/Item.js');

describe('AdminController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com', role: 'user' },
        { id: 2, name: 'User 2', email: 'user2@test.com', role: 'user' }
      ];
      User.findAll.mockResolvedValue(mockUsers);

      await getAllUsers(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        where: { role: 'user' },
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('toggleUserStatus', () => {
    it('should toggle user status successfully', async () => {
      req.params.id = '2';
      const mockUser = {
        id: 2, name: 'User', email: 'user@test.com',
        role: 'user', isActive: false,
        update: jest.fn()
      };
      User.findByPk.mockResolvedValue(mockUser);

      await toggleUserStatus(req, res);

      expect(mockUser.update).toHaveBeenCalledWith({ isActive: true });
      expect(res.json).toHaveBeenCalledWith({
        message: 'User activated successfully',
        user: { id: 2, name: 'User', email: 'user@test.com', isActive: false }
      });
    });

    it('should not allow modifying admin user', async () => {
      req.params.id = '1';
      User.findByPk.mockResolvedValue({ role: 'admin' });

      await toggleUserStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot modify admin user' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      req.params.id = '2';
      const mockUser = {
        id: 2, role: 'user',
        destroy: jest.fn()
      };
      User.findByPk.mockResolvedValue(mockUser);
      Item.destroy.mockResolvedValue();

      await deleteUser(req, res);

      expect(Item.destroy).toHaveBeenCalledWith({ where: { userId: '2' } });
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should not allow deleting admin user', async () => {
      req.params.id = '1';
      User.findByPk.mockResolvedValue({ role: 'admin' });

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot delete admin user' });
    });
  });
});