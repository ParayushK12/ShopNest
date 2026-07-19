# 🛍️ ShopNest - Premium E-Commerce Application

ShopNest is a modern, responsive, and full-featured MERN (MongoDB, Express, React, Node.js) stack e-commerce web application. Designed with high performance, elegant UI transitions, and modularity in mind, ShopNest delivers a seamless shopping experience for consumers and a comprehensive management panel for administrators.

---

## 🌟 Key Features

### 🛒 Customer Experience
*   **Intuitive Product Catalog:** Browse a dynamic grid of products with advanced filters (gender, category, price) and sorting.
*   **Detailed Product Views:** High-quality image carousels, dynamic stock tracking, sizing selection, and related product recommendations.
*   **Persistent Shopping Cart:** Fully functional cart with real-time price calculation, item quantity adjustments, and server/local state synchronization.
*   **Wishlist:** One-click wishlist to save favorite items for later.
*   **Secure Checkout & Payments:** Integrated with **Razorpay** checkout for instant, secure mock/real digital payments.
*   **Order History & Tracking:** View detailed receipts, past orders, and live delivery status tracking (Pending ➡️ Shipped ➡️ Delivered).
*   **Account Authentication:** Secured signup, login, and profile updates powered by JWT and hashed passwords, featuring email verification via SMTP.

### 🛡️ Administrative Controls (Admin Dashboard)
*   **Business Analytics:** Interactive graphs and cards displaying real-time metrics like Total Sales, Active Users, Order Counts, and Average Order Value.
*   **Product Management:** Fully CRUD-capable interface to add, edit, or delete items, with image uploads directly connected to **Cloudinary CDN**.
*   **Order Operations:** Update order statuses, track customer details, and supervise payment completions.

---

## 💻 Tech Stack

### Frontend
*   **Library:** React 19 (Hooks, Functional Components)
*   **Routing:** React Router v7
*   **State Management:** React Context API (AuthContext, CartContext, WishlistContext)
*   **Styling:** Modern Vanilla CSS (Fluid grids, Custom Variables, Transitions, Glassmorphism elements)
*   **Validation:** Zod (Client-side form inputs and schemas)

### Backend
*   **Runtime & Framework:** Node.js, Express.js (v5)
*   **Database:** MongoDB via Mongoose ODM (v9)
*   **Security:** JSON Web Tokens (JWT) for session management, BcryptJS for password hashing
*   **Media Storage:** Cloudinary (CDN image hosting) via Multer (file upload parser)
*   **Mailer Service:** Nodemailer (SMTP configuration for emails)
*   **Payment Gateway:** Razorpay SDK
*   **Validation:** Zod (Backend request payload validation schemas)

---

## 📂 Project Structure

```text
ShopNest/
├── backend/                  # Node.js + Express API Server
│   ├── config/               # Database and 3rd-party service integrations
│   ├── controllers/          # Business logic handlers for API endpoints
│   ├── middlewares/          # Custom auth, role-check, and validation middlewares
│   ├── model/                # Mongoose Database schemas (User, Product, Order)
│   ├── routes/               # API endpoints (Auth, Products, Orders, Payments, Analytics)
│   ├── utils/                # Helper utilities (email senders, token generators)
│   ├── seed.js               # Database seeding script
│   └── index.js              # Server entry point
│
├── frontend/                 # React SPA Client
│   ├── public/               # Public assets and index.html
│   └── src/                  # Application source
│       ├── admin/            # Admin-specific components and sub-views
│       ├── components/       # Shared UI (Navbar, Footer, Product Cards)
│       ├── context/          # State managers (Auth, Cart, Wishlist context)
│       ├── pages/            # Page components (Home, Cart, Products, Checkout, etc.)
│       ├── styles/           # Global design system variables and component CSS
│       ├── App.jsx           # App routes and providers
│       └── index.js          # App mounting point
│
├── seedData/                 # Initial catalog catalog images/JSON datasets
│   ├── men/                  # Menswear products
│   └── women/                # Womenswear products
│
├── package.json              # Monorepo task configurations
└── README.md                 # Project documentation
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `/backend` directory and configure the following variables:

| Variable Name | Description | Example / Default Value |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_super_secret_jwt_key` |
| `GMAIL_USER` | SMTP Sender Gmail Address | `example@gmail.com` |
| `GMAIL_PASS` | App password for Gmail SMTP | `abcd efgh ijkl mnop` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Storage Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary credential API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary credential API Secret | `your_api_secret` |
| `RAZORPAY_KEY_ID` | Razorpay Client API Key | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Client API Secret | `secret_...` |

---

## 🚀 Getting Started

Follow these steps to run ShopNest locally on your machine:

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas Cloud instance)
*   Registered accounts for Cloudinary and Razorpay (in test mode)

### 2. Clone the Repository
```bash
git clone https://github.com/ParayushK12/ShopNest.git
cd ShopNest
```

### 3. Install Dependencies
Run the install command from the root directory. This automatically triggers installation scripts for both the frontend and backend:
```bash
npm install
```

### 4. Setup Environment Variables
Configure the `/backend/.env` file with your credentials according to the [Environment Variables](#️-environment-variables-setup) table above.

### 5. Seed the Catalog Data (Optional but Recommended)
To populate the store database with sample products, users, and admin credentials, run:
```bash
cd backend
npm run data:import
```
*This seeds:*
*   **Admin User:** `admin@shopnest.com` (Password: `admin123`)
*   **Default Customers:** `john@shopnest.com`, `jane@shopnest.com` (Password: `user123`)
*   Sample items parsed dynamically from the `seedData` folder.

### 6. Spin Up the Development Server
Navigate back to the root directory and start the application:
```bash
cd ..
npm run dev
```
This launches the backend API server on `http://localhost:5000` and the React frontend on `http://localhost:3000` concurrently.

---

## 🛠️ CLI Script Commands

Manage your application tasks with the following commands:

### Root Scripts
*   `npm install` - Installs dependencies for the workspace, backend, and frontend directories.
*   `npm run dev` - Runs both frontend React dev server and backend nodemon process concurrently.
*   `npm run build` - Builds production-optimized bundles for the client.

### Backend Scripts
*   `npm start` - Starts the Express server using standard Node.js.
*   `npm run dev` - Runs the Express server using nodemon for automatic file-change reloads.
*   `npm run data:import` - Runs the seeder to reset the database and import sample data.
*   `npm run data:destroy` - Clears all database records.

### Frontend Scripts
*   `npm start` - Starts the local React hot-reloading development server.
*   `npm run build` - Compiles the React application into static files inside `/build`.

---

## 📄 License
This project is licensed under the **ISC License**. Feel free to use, modify, and build upon this project for your personal or commercial applications.

---

*Made with ♥ by [parayush](https://github.com/ParayushK12)*
