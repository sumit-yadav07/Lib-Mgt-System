import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bookRoutes from './routes/book.routes.js';
import userRoutes from './routes/user.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Root route for server testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Debugging: Log all registered routes
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`Route registered: ${r.route.path}`);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
  // After all your routes are registered
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if(middleware.route){ // routes registered directly on the app
      routes.push(middleware.route.path);
    } else if(middleware.name === 'router'){ // router middleware 
      middleware.handle.stack.forEach(handler => {
        if(handler.route){
          routes.push(handler.route.path);
        }
      });
    }
  });
  res.json(routes);
});
