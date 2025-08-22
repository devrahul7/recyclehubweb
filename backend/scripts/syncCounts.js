import { sequelize } from '../config/database.js';
import Item from '../models/Item.js';
import Like from '../models/Like.js';
import Review from '../models/Review.js';

const syncCounts = async () => {
  try {
    console.log('Starting count synchronization...');
    
    const items = await Item.findAll();
    
    for (const item of items) {
      const likesCount = await Like.count({ where: { itemId: item.id } });
      const reviewsCount = await Review.count({ where: { itemId: item.id } });
      
      const reviews = await Review.findAll({
        where: { itemId: item.id },
        attributes: ['rating']
      });
      
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      await item.update({
        likesCount,
        reviewsCount,
        averageRating: averageRating.toFixed(2)
      });
      
      console.log(`Updated item ${item.id}: ${likesCount} likes, ${reviewsCount} reviews, ${averageRating.toFixed(2)} avg rating`);
    }
    
    console.log('Count synchronization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during count synchronization:', error);
    process.exit(1);
  }
};

syncCounts();