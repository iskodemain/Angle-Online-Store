import { sequelize } from './sequelize.js';

// Import all models so Sequelize registers them before sync
import '../models/customers.js';
import '../models/product.js';
import '../models/orders.js';

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('All tables have been synced successfully.');
    } catch (error) {
        console.error('Error syncing database tables:', error);
        throw error; // bubble up so the server startup fails loudly
    }
};

export default syncDatabase;
