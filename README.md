# Library-Management-System

This is a full-stack library management system that allows users to borrow and return books. It uses MongoDB as the database, Express.js for the backend API, and React for the frontend.

## Features

- **User Authentication**: Secure login and registration with JWT tokens.
- **Book Management**: Admin can add, update, and delete books.
- **Transaction Management**: Users can borrow and return books, and the system tracks these transactions.
- **Admin Role**: Admin can manage books and view all transactions, while regular users can only view their own transactions.

## Tech Stack

- **Frontend**: React, Zustand (State Management), Axios
- **Backend**: Node.js, Express.js, MongoDB (using Mongoose), JWT Authentication
- **Database**: MongoDB Atlas (Cloud Database)
- **Deployment**: Local development
  ## Demo
<img src="demo/Screenshot (6).png" alt="Demo Image 6" width="500"/>
<img src="demo/Screenshot (7).png" alt="Demo Image 7" width="500"/>
<img src="demo/Screenshot (8).png" alt="Demo Image 8" width="500"/>
<img src="demo/Screenshot (9).png" alt="Demo Image 9" width="500"/>
<img src="demo/Screenshot (10).png" alt="Demo Image 10" width="500"/>
<img src="demo/Screenshot (11).png" alt="Demo Image 11" width="500"/>
<img src="demo/Screenshot (12).png" alt="Demo Image 12" width="500"/>
<img src="demo/Screenshot (13).png" alt="Demo Image 13" width="500"/>

## Setting up the Project

### 1. Create a MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.
2. Create a new cluster and select **"M0 Sandbox"** if you're on a free tier.
3. Create a database called `libraryDB` with collections for `users`, `books`, and `transactions`.
4. Get the connection string for your cluster by going to **Database** > **Connect** > **Connect your application**.
5. Copy the connection string and replace `<password>` with your database password.

### 2. Setting up Environment Variables

1. In the root directory of your project, create a `.env` file.

2. Add the following to your `.env` file, replacing `<your-mongo-uri>` with your MongoDB connection string:

    ```bash
    MONGODB_URI=<your-mongo-uri>
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```

### 3. Backend Setup

1. Open your terminal and navigate to the backend directory.

    ```bash
    cd backend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Run the backend server:

    ```bash
    npm run dev
    ```

    This will start the backend server on `http://localhost:5000`.

### 4. Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory.

    ```bash
    cd frontend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Run the frontend:

    ```bash
    npm run dev
    ```

    This will start the frontend on `http://localhost:5173`.

### 5. Creating Users and Testing the App

#### Option 1: Manually Create Users in the Backend

1. You can create a new user by modifying the `user` collection in MongoDB directly from MongoDB Atlas or by using a Postman request.
2. Set the role to `admin` for admin users, and `user` for regular users.

#### Option 2: Use Postman to Create Users

1. **POST** request to `http://localhost:5000/api/users/register` with the following body:

    ```json
    {
      "name": "Admin User",
      "email": "admin@example.com",
      "password": "password123",
      "role": "admin"
    }
    ```

2. **POST** request to `http://localhost:5000/api/users/login` to log in and get the JWT token.

3. Use the token in the Authorization header for subsequent requests.

### 6. Using the Application

- **Books**: Admin can manage books (create, update, delete) via API routes like `POST /api/books`, `PUT /api/books/:id`, `DELETE /api/books/:id`.
- **Transactions**: Users can borrow and return books via the transaction API routes (`POST /api/transactions/borrow/:bookId` and `POST /api/transactions/return/:bookId`).
  
  Ensure the book is available before borrowing. Once returned, the book’s availability will be updated.

### API Endpoints

#### Book Routes

- **GET** `/api/books`: Get all books
- **POST** `/api/books`: Add a new book (Admin only)
- **GET** `/api/books/:id`: Get a specific book by ID
- **PUT** `/api/books/:id`: Update a book (Admin only)
- **DELETE** `/api/books/:id`: Delete a book (Admin only)

#### Transaction Routes

- **POST** `/api/transactions/borrow/:bookId`: Borrow a book (User only)
- **POST** `/api/transactions/return/:bookId`: Return a book (User only)
- **GET** `/api/transactions/my`: Get a user’s transactions (User only)
- **GET** `/api/transactions`: Get all transactions (Admin only)

#### User Routes

- **POST** `/api/users/register`: Register a new user
- **POST** `/api/users/login`: Log in a user to get a JWT token

## Project Structure

```bash
.
├── backend
│   ├── controllers
│   │   ├── book.controller.js
│   │   ├── transaction.controller.js
│   │   └── user.controller.js
│   ├── models
│   │   ├── book.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes
│   │   ├── book.routes.js
│   │   ├── transaction.routes.js
│   │   └── user.routes.js
│   ├── middleware
│   │   └── auth.middleware.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend
    ├── src
    │   ├── components
    │   ├── store
    │   ├── pages
    │   └── App.js
    ├── public
    ├── .env
    ├── package.json
    └── README.md
Troubleshooting
CORS Issues: If you face CORS errors, make sure you’ve set up cors correctly in the backend as shown in the code above.
JWT Token Expiry: If your JWT token expires, you will need to log in again to get a new token.
