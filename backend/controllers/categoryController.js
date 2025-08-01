import Category from '../models/Category.js';
import Item from '../models/Item.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color, sortOrder } = req.body;
    
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      icon,
      color,
      sortOrder
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    const whereClause = includeInactive === 'true' ? {} : { isActive: true };
    
    const categories = await Category.findAll({
      where: whereClause,
      include: [{
        model: Item,
        as: 'categoryItems',
        attributes: ['id'],
        required: false
      }],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    const categoriesWithCount = categories.map(category => ({
      ...category.toJSON(),
      itemCount: category.categoryItems ? category.categoryItems.length : 0,
      categoryItems: undefined
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [{
        model: Item,
        as: 'categoryItems',
        attributes: ['id', 'title', 'image', 'status', 'createdAt']
      }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, color, sortOrder, isActive } = req.body;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      icon: icon !== undefined ? icon : category.icon,
      color: color || category.color,
      sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
      isActive: isActive !== undefined ? isActive : category.isActive
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const itemCount = await Item.count({ where: { categoryId: id } });
    if (itemCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. ${itemCount} items are using this category.` 
      });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update({ isActive: !category.isActive });
    
    res.json({ 
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories must be an array' });
    }

    const updatePromises = categories.map((cat, index) => 
      Category.update(
        { sortOrder: index },
        { where: { id: cat.id } }
      )
    );

    await Promise.all(updatePromises);
    
    res.json({ message: 'Categories reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};