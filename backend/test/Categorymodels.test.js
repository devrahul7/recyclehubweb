import Category from '../models/Category.js';
import { sequelize } from '../config/database.js';

describe('Category Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // recreate tables
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a category with all fields', async () => {
    const category = await Category.create({
      name: 'Electronics',
      description: 'All electronic items',
      icon: 'fa-tv',
      color: '#FF5733',
      isActive: true,
      sortOrder: 1
    });
    
    expect(category.id).toBeDefined();
    expect(category.name).toBe('Electronics');
    expect(category.description).toBe('All electronic items');
    expect(category.icon).toBe('fa-tv');
    expect(category.color).toBe('#FF5733');
    expect(category.isActive).toBe(true);
    expect(category.sortOrder).toBe(1);
    expect(category.createdAt).toBeDefined();
    expect(category.updatedAt).toBeDefined();
  });

  it('should create a category with only required fields', async () => {
    const category = await Category.create({
      name: 'Books'
    });
    
    expect(category.name).toBe('Books');
    expect(category.color).toBe('#10B981'); // default value
    expect(category.isActive).toBe(true); // default value
    expect(category.sortOrder).toBe(0); // default value
    expect(category.description).toBeNull();
    expect(category.icon).toBeNull();
  });

  it('should not create a category without a name', async () => {
    await expect(Category.create({})).rejects.toThrow();
    await expect(Category.create({ description: 'No name' })).rejects.toThrow();
  });

  it('should enforce unique name constraint', async () => {
    await Category.create({ name: 'UniqueTest' });
    await expect(Category.create({ name: 'UniqueTest' })).rejects.toThrow();
  });

  it('should update a category', async () => {
    const category = await Category.create({
      name: 'Fashion',
      color: '#000000'
    });
    
    category.description = 'Updated description';
    category.color = '#FFFFFF';
    await category.save();
    
    expect(category.description).toBe('Updated description');
    expect(category.color).toBe('#FFFFFF');
  });

  it('should delete a category', async () => {
    const category = await Category.create({
      name: 'ToDelete'
    });
    
    const categoryId = category.id;
    await category.destroy();
    
    const found = await Category.findByPk(categoryId);
    expect(found).toBeNull();
  });

  it('should find categories by criteria', async () => {
    await Category.create({ name: 'Active1', isActive: true });
    await Category.create({ name: 'Inactive1', isActive: false });
    
    const activeCategories = await Category.findAll({ 
      where: { isActive: true } 
    });
    
    expect(activeCategories.length).toBeGreaterThan(0);
    activeCategories.forEach(cat => {
      expect(cat.isActive).toBe(true);
    });
  });

  it('should validate field types', async () => {
    const category = await Category.create({
      name: 'TypeTest',
      sortOrder: 999,
      isActive: false
    });
    
    expect(typeof category.id).toBe('number');
    expect(typeof category.name).toBe('string');
    expect(typeof category.sortOrder).toBe('number');
    expect(typeof category.isActive).toBe('boolean');
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
  });
});
