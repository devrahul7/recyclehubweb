import Like from '../models/Like.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { sequelize } from '../config/database.js';

describe('Like Model', () => {
  let testUser1, testUser2, testItem1, testItem2;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create test users and items
    testUser1 = await User.create({
      name: 'Test User 1',
      email: 'user1@test.com',
      password: 'password123'
    });
    
    testUser2 = await User.create({
      name: 'Test User 2', 
      email: 'user2@test.com',
      password: 'password123'
    });
    
    testItem1 = await Item.create({
      title: 'Test Item 1',
      description: 'Test description 1',
      userId: testUser1.id
    });
    
    testItem2 = await Item.create({
      title: 'Test Item 2',
      description: 'Test description 2', 
      userId: testUser2.id
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a like with userId and itemId', async () => {
    const like = await Like.create({
      userId: testUser1.id,
      itemId: testItem1.id
    });
    
    expect(like.id).toBeDefined();
    expect(like.userId).toBe(testUser1.id);
    expect(like.itemId).toBe(testItem1.id);
    expect(like.createdAt).toBeDefined();
    expect(like.updatedAt).toBeDefined();
  });

  it('should enforce unique constraint on userId and itemId combination', async () => {
    await Like.create({
      userId: testUser1.id,
      itemId: testItem2.id
    });
    
    // Attempting to create duplicate like should fail
    await expect(Like.create({
      userId: testUser1.id,
      itemId: testItem2.id
    })).rejects.toThrow();
  });

  it('should allow same user to like different items', async () => {
    const like1 = await Like.create({
      userId: testUser2.id,
      itemId: testItem1.id
    });
    
    const like2 = await Like.create({
      userId: testUser2.id,
      itemId: testItem2.id
    });
    
    expect(like1.userId).toBe(testUser2.id);
    expect(like2.userId).toBe(testUser2.id);
    expect(like1.itemId).not.toBe(like2.itemId);
  });

  it('should allow different users to like same item', async () => {
    const newItem = await Item.create({
      title: 'Popular Item',
      description: 'Everyone likes this',
      userId: testUser1.id
    });
    
    const like1 = await Like.create({
      userId: testUser1.id,
      itemId: newItem.id
    });
    
    const like2 = await Like.create({
      userId: testUser2.id,
      itemId: newItem.id
    });
    
    expect(like1.itemId).toBe(like2.itemId);
    expect(like1.userId).not.toBe(like2.userId);
  });

  it('should require userId field', async () => {
    await expect(Like.create({
      itemId: testItem1.id
    })).rejects.toThrow();
  });

  it('should require itemId field', async () => {
    await expect(Like.create({
      userId: testUser1.id
    })).rejects.toThrow();
  });

  it('should require both userId and itemId', async () => {
    await expect(Like.create({})).rejects.toThrow();
  });

  it('should delete a like successfully', async () => {
    const like = await Like.create({
      userId: testUser1.id,
      itemId: testItem1.id
    });
    
    const likeId = like.id;
    await like.destroy();
    
    const found = await Like.findByPk(likeId);
    expect(found).toBeNull();
  });

  it('should find likes by userId', async () => {
    await Like.create({
      userId: testUser1.id,
      itemId: testItem1.id
    });
    
    const userLikes = await Like.findAll({
      where: { userId: testUser1.id }
    });
    
    expect(userLikes.length).toBeGreaterThan(0);
    userLikes.forEach(like => {
      expect(like.userId).toBe(testUser1.id);
    });
  });

  it('should find likes by itemId', async () => {
    await Like.create({
      userId: testUser2.id,
      itemId: testItem1.id
    });
    
    const itemLikes = await Like.findAll({
      where: { itemId: testItem1.id }
    });
    
    expect(itemLikes.length).toBeGreaterThan(0);
    itemLikes.forEach(like => {
      expect(like.itemId).toBe(testItem1.id);
    });
  });

  it('should validate field types', async () => {
    const like = await Like.create({
      userId: testUser1.id,
      itemId: testItem2.id
    });
    
    expect(typeof like.id).toBe('number');
    expect(typeof like.userId).toBe('number');
    expect(typeof like.itemId).toBe('number');
    expect(like.createdAt).toBeInstanceOf(Date);
    expect(like.updatedAt).toBeInstanceOf(Date);
  });

  it('should count likes for specific item', async () => {
    const newItem = await Item.create({
      title: 'Test Count Item',
      description: 'For counting likes',
      userId: testUser1.id
    });
    
    await Like.create({
      userId: testUser1.id,
      itemId: newItem.id
    });
    
    await Like.create({
      userId: testUser2.id,
      itemId: newItem.id
    });
    
    const likeCount = await Like.count({
      where: { itemId: newItem.id }
    });
    
    expect(likeCount).toBe(2);
  });
});
