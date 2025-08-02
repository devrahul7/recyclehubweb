import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync();
    
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();