# Backend API Setup

## Prerequisites
- Node.js installed
- MySQL running on localhost:3306
- Database `inventory_db` created

## Setup Instructions

1. **Create the database** (if not already created):
   ```sql
   CREATE DATABASE inventory_db;
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file** in the `backend` folder:
   ```
   DATABASE_URL="mysql://root@localhost:3306/inventory_db"
   JWT_SECRET="your-secret-key-change-this-in-production"
   PORT=5000
   ```

4. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database** (creates default admin and test users):
   ```bash
   node seed.js
   ```

   Default users created:
   - Admin: `admin@inventory.com` / `admin123`
   - User: `user@inventory.com` / `user123`

7. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /api/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "admin@inventory.com",
    "role": "admin"
  }
}
```

### POST /api/register
Register a new user (optional).

### GET /api/me
Verify token and get current user info.

### GET /api/health
Health check endpoint.

