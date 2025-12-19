# Inventory Management System (IMS)

## Features
*   **User Authentication**: Secure Login and Registration system using JWT.
*   **Dashboard**: Overview of total items, categories, low stock alerts, and recent activity.
*   **Inventory Management**: Create, update, and delete categories and items.
*   **Stock Tracking**: Log stock "In" (Restock) and "Out" (Usage/Sale) movements with granular tracking.
*   **Sales System**: Record sales with automatic stock deduction and revenue calculation.
*   **Forecasting**: Smart insights into stock trends (Safe, Low, Out of Stock predictions).
*   **Responsive Design**: Built with React and Tailwind CSS for a seamless experience on all devices.
*   **Visual Aesthetics**: Enhanced with GSAP animations for a premium feel.

### Frontend
*   **React** (Create React App)
*   **Tailwind CSS** (Styling)
*   **Lucide React** (Icons)
*   **GSAP** (Animations)
*   **Framer Motion** (Transitions)

### Backend
*   **Node.js & Express**
*   **Prisma ORM** (Database interaction)
*   **PostgreSQL** (Neon Database)
*   **JSON Web Tokens (JWT)** (Auth)

### Method for hosting
*   **Vercel**: Hosting for both frontend and serverless backend.


**Database Setup**
    Database is hosted on Neon.

## Project Structure

```
inventory-management/
├── api/                # Vercel Serverless Function entry point
├── backend/            # Express Backend code
│   ├── prisma/         # Database schema
│   ├── routes/         # API Endpoints
│   └── server.js       # Main server file
├── src/                # React Frontend code
│   ├── components/     # Reusable UI components
│   ├── utils/          # API helpers
│   └── App.js          # Main App Logic
├── public/             # Static assets
└── vercel.json         # Vercel routing configuration
```