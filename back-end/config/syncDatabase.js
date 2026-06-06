import { sequelize } from './sequelize.js';

// Import all models so Sequelize registers them before sync
import '../models/customers.js';
import '../models/product.js';
import '../models/orders.js';

/**
 * Syncs all Sequelize models with the database.
 *
 * - { alter: true }  → updates existing tables to match the model
 *                      without dropping data (safe for development)
 * - { force: true }  → DROPS and recreates all tables every run
 *                      (use only when you want a clean slate)
 *
 * We use `alter: true` here so your data is preserved across restarts.
 */
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
