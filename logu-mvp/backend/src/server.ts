import app from './app';
import sequelize from './config/database';

// Port configuration
const PORT = process.env.PORT || 5001;

// Function to start the server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models (in development mode)
    if (process.env.NODE_ENV === 'development') {
      // Use a more cautious approach to avoid constraint errors
      await sequelize.sync({ alter: false });
      console.log('Database synced successfully');
    }
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`⚡️ LogU API server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 