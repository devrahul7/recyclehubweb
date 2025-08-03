import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sequelize } from '../config/database.js';

describe('Notification Model', () => {
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Create a test user for foreign key relation
    testUser = await User.create({
      name: 'Test User',
      email: 'testuser@test.com',
      password: 'password123'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a notification with all required fields', async () => {
    const notification = await Notification.create({
      userId: testUser.id,
      title: 'Welcome',
      message: 'Welcome to our service!',
      type: 'success',
      isRead: false,
      actionUrl: 'https://example.com',
      priority: 'high'
    });

    expect(notification.id).toBeDefined();
    expect(notification.userId).toBe(testUser.id);
    expect(notification.title).toBe('Welcome');
    expect(notification.message).toBe('Welcome to our service!');
    expect(notification.type).toBe('success');
    expect(notification.isRead).toBe(false);
    expect(notification.actionUrl).toBe('https://example.com');
    expect(notification.priority).toBe('high');
    expect(notification.createdAt).toBeDefined();
    expect(notification.updatedAt).toBeDefined();
  });

  it('should use default values for type, isRead, and priority if not provided', async () => {
    const notification = await Notification.create({
      userId: testUser.id,
      title: 'Default values test',
      message: 'This uses defaults'
    });

    expect(notification.type).toBe('info');
    expect(notification.isRead).toBe(false);
    expect(notification.priority).toBe('medium');
  });

  it('should not create notification without userId', async () => {
    await expect(Notification.create({
      title: 'No userId',
      message: 'Missing userId'
    })).rejects.toThrow();
  });

  it('should not create notification without title', async () => {
    await expect(Notification.create({
      userId: testUser.id,
      message: 'Missing title'
    })).rejects.toThrow();
  });

  it('should not create notification without message', async () => {
    await expect(Notification.create({
      userId: testUser.id,
      title: 'Missing message'
    })).rejects.toThrow();
  });

  it('should enforce ENUM constraints on type and priority', async () => {
    // Invalid type
    await expect(Notification.create({
      userId: testUser.id,
      title: 'Invalid enum type',
      message: 'Invalid type field',
      type: 'invalid'
    })).rejects.toThrow();

    // Invalid priority
    await expect(Notification.create({
      userId: testUser.id,
      title: 'Invalid enum priority',
      message: 'Invalid priority field',
      priority: 'urgent'
    })).rejects.toThrow();
  });

  it('should update a notification', async () => {
    const notification = await Notification.create({
      userId: testUser.id,
      title: 'Update test',
      message: 'Before update'
    });

    notification.message = 'After update';
    notification.isRead = true;
    await notification.save();

    expect(notification.message).toBe('After update');
    expect(notification.isRead).toBe(true);
  });

  it('should delete a notification', async () => {
    const notification = await Notification.create({
      userId: testUser.id,
      title: 'Delete test',
      message: 'To be deleted'
    });

    const id = notification.id;
    await notification.destroy();

    const findNotification = await Notification.findByPk(id);
    expect(findNotification).toBeNull();
  });

  it('should find notifications by userId', async () => {
    await Notification.create({
      userId: testUser.id,
      title: 'Find test 1',
      message: 'Message 1'
    });
    await Notification.create({
      userId: testUser.id,
      title: 'Find test 2',
      message: 'Message 2'
    });

    const notifications = await Notification.findAll({
      where: { userId: testUser.id }
    });

    expect(notifications.length).toBeGreaterThanOrEqual(2);
    notifications.forEach(noti => {
      expect(noti.userId).toBe(testUser.id);
    });
  });

  it('should validate field types', async () => {
    const notification = await Notification.create({
      userId: testUser.id,
      title: 'Type test',
      message: 'Field types'
    });

    expect(typeof notification.id).toBe('number');
    expect(typeof notification.userId).toBe('number');
    expect(typeof notification.title).toBe('string');
    expect(typeof notification.message).toBe('string');
    expect(typeof notification.type).toBe('string');
    expect(typeof notification.isRead).toBe('boolean');
    expect(typeof notification.actionUrl === 'string' || notification.actionUrl === null).toBe(true);
    expect(typeof notification.priority).toBe('string');
    expect(notification.createdAt).toBeInstanceOf(Date);
    expect(notification.updatedAt).toBeInstanceOf(Date);
  });

  it('should validate all ENUM values for type field', async () => {
    const validTypes = ['info', 'success', 'warning', 'error'];
    
    for (const type of validTypes) {
      const notification = await Notification.create({
        userId: testUser.id,
        title: `Test ${type}`,
        message: `Testing ${type} type`,
        type: type
      });
      expect(notification.type).toBe(type);
    }
  });

  it('should validate all ENUM values for priority field', async () => {
    const validPriorities = ['low', 'medium', 'high'];
    
    for (const priority of validPriorities) {
      const notification = await Notification.create({
        userId: testUser.id,
        title: `Test ${priority}`,
        message: `Testing ${priority} priority`,
        priority: priority
      });
      expect(notification.priority).toBe(priority);
    }
  });

  it('should allow null actionUrl', async () => {
    const notification = await Notification.create({
      userId: testUser.id,
      title: 'No action URL',
      message: 'This has no action URL',
      actionUrl: null
    });

    expect(notification.actionUrl).toBeNull();
  });
});
