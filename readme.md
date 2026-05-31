# MERN Ecommerce App

A full-stack ecommerce application with separate `client`, `admin`, and `server` projects.

- `client/`: React frontend for shoppers with email and Google authentication, product browsing, and cart management.
- `admin/`: React admin dashboard for product management, secure admin login, and inventory control.
- `server/`: Express + MongoDB API with Firebase token verification, JWT auth, Cloudinary image uploads, and cart persistence.

---

## Features

- User registration and login with email/password
- Google login and registration via Firebase auth
- Product browsing and product detail pages
- Shopping cart add/remove functionality
- Secure admin panel for login, add product, and delete product
- Cloudinary-based product image upload
- MongoDB Atlas database for products and users
- JWT authentication for protected routes

---

## Folder Structure

- `admin/` - Admin dashboard frontend
- `client/` - User-facing frontend
- `server/` - Backend API, database, auth, and file upload logic

---

## Tech Stack

- Frontend: React, Vite, React Router, Redux Toolkit, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Cloudinary, Firebase Admin, JWT
- Auth: Email/password + Google OAuth via Firebase

---

## Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB Atlas cluster or MongoDB connection string
- Cloudinary account for image uploads
- Firebase project with admin service account JSON for Google auth verification

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following values:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> The backend also uses `server/config/firebase-adminsdk.json` for Firebase Admin SDK credentials. Keep that file secure and do not commit sensitive keys.

---

## Setup

Install dependencies in each project folder:

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

---

## Run Locally

Open three terminals and run each project separately.

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the client frontend:

```bash
cd client
npm run dev
```

3. Start the admin frontend:

```bash
cd admin
npm run dev
```

By default, Vite serves frontends with ports similar to `5173` and `5174`.

---

## API Endpoints

### Auth routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google-login` - Login with Google token
- `POST /api/auth/google-register` - Register with Google token

### Admin routes

- `POST /api/admin/login` - Admin login
- `GET /api/admin/get-all-products` - List all products
- `GET /api/admin/get-single-product/:productId` - Get product by ID
- `POST /api/admin/add-product` - Add product with image upload
- `DELETE /api/admin/delete-product/:productId` - Delete product

### User routes

- `GET /api/user/me` - Get current authenticated user
- `POST /api/user/add-to-cart` - Add product to cart
- `POST /api/user/remove-from-cart` - Remove product from cart

---

## Admin Panel

The admin dashboard supports:

- Secure admin login
- Product creation with title, description, category, sizes, price, and image
- Product listing and deletion
- Orders page placeholder for future extension

---

## Client App

The shopper app supports:

- User registration and login
- Google social login
- Product browsing and product detail pages
- Add to cart and remove from cart
- Cart total display and quantity management

---

## Notes

- Ensure `server` is running before using either frontend, because both `client` and `admin` call backend APIs.
- Replace placeholder environment values with your own credentials before deployment.
- If you change the backend port, update the `serverUrl` settings in both `client` and `admin` source code to match.

---

## License

This project is provided as-is.
