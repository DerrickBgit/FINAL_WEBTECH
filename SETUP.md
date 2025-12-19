# Database Setup Guide

## Quick Start

Follow these steps to connect your inventory management app to MySQL:

### 1. Create MySQL Database

Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE inventory_db;
```

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file in the `backend` folder with this content:
   ```
   DATABASE_URL="mysql://root@localhost:3306/inventory_db"
   JWT_SECRET="your-secret-key-change-this-in-production"
   PORT=5000
   ```

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

5. Run database migrations (creates the users table):
   ```bash
   npm run prisma:migrate
   ```
   When prompted, name the migration: `init`

6. Seed the database with default users:
   ```bash
   node seed.js
   ```

   This creates:
   - **Admin user**: `admin@inventory.com` / Password: `admin123`
   - **Regular user**: `user@inventory.com` / Password: `user123`

7. Start the backend server:
   ```bash
   npm start
   ```
   Or for development (auto-reload):
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. In a new terminal, go back to the project root:
   ```bash
   cd ..
   ```

2. Make sure frontend dependencies are installed:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

### 4. Test Login

1. Navigate to `http://localhost:3000/login`
2. Try logging in with:
   - Email: `admin@inventory.com`
   - Password: `admin123`

## Troubleshooting

- **Database connection error**: Make sure MySQL is running and the database `inventory_db` exists
- **Port 5000 already in use**: Change `PORT` in `backend/.env` to a different port
- **CORS errors**: Make sure the backend is running before accessing the frontend
- **Prisma errors**: Make sure you've run `npm run prisma:generate` and `npm run prisma:migrate`

## Next Steps

- The login token is stored in `localStorage` as `token`
- You can access user info from `localStorage.getItem('user')`
- Add protected routes that check for authentication
- Create more users via the `/api/register` endpoint

