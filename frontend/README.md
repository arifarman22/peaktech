# PeakTech eCommerce Application

A full-stack eCommerce platform built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Email/Password Registration** with OTP verification
- **Login** with JWT-based authentication
- **Google OAuth** (configuration required)
- Secure HTTP-only cookies for token storage
- Role-based access control (User/Admin)

### Product Management
- Product CRUD operations (Admin)
- Category management
- Search and filtering (category, price range)
- Pagination and sorting
- Inventory tracking
- Product images support

### Shopping Experience
- Browse products with filtering
- Shopping cart management
- Checkout process with shipping address
- Order history
- Automatic tax calculation (10%)
- Free shipping over $100

### Admin Panel
- Product management
- Order management
- Category management
- User management

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Email service (Gmail recommended for OTP)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd "e:\PeakTech Ecommerce\PeakTech-E-Commerce-main"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/peaktech-ecommerce
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/peaktech-ecommerce

   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Email (for OTP - Gmail recommended)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   EMAIL_FROM=noreply@peaktech.com

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=PeakTech

   # Admin Account
   ADMIN_EMAIL=admin@peaktech.com
   ADMIN_PASSWORD=admin123456
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product endpoints
│   │   ├── cart/         # Shopping cart
│   │   ├── orders/       # Order management
│   │   └── admin/        # Admin endpoints
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── shop/             # Shop page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   └── Navbar.tsx
├── lib/
│   ├── models/           # Mongoose models
│   ├── contexts/         # React contexts
│   ├── auth.ts           # Auth utilities
│   ├── db.ts             # MongoDB connection
│   ├── email.ts          # Email service
│   ├── middleware.ts     # Auth middleware
│   └── validations.ts    # Zod schemas
└── public/               # Static assets
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Get product details

### Categories
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart?productId=xxx` - Remove from cart

### Orders
- `POST /api/orders` - Create order (checkout)
- `GET /api/orders` - Get user orders

### Admin
- `POST /api/admin/products` - Create product
- `GET /api/admin/products` - List all products
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/categories` - Create category

## 🎨 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Validation**: Zod
- **Notifications**: React Hot Toast

## 🚀 Building for Production

```bash
npm run build
npm start
```

## 📝 Creating Sample Data

To test the application, you'll need to:

1. **Create a user account** via `/register`
2. **Create categories** (as admin via API or manually in database)
3. **Create products** (as admin via API or manually in database)

Example category creation (via MongoDB or API):
```javascript
{
  name: "Smartphones",
  slug: "smartphones",
  description: "Latest smartphones and mobile devices"
}
```

Example product creation (via MongoDB or API):
```javascript
{
  name: "iPhone 15 Pro",
  slug: "iphone-15-pro",
  description: "The latest iPhone with titanium design",
  price: 999.99,
  quantity: 50,
  category: "<category-id>",
  images: ["https://example.com/iphone.jpg"],
  status: "active"
}
```

## 🔐 Creating Admin User

To create an admin user, register normally, then update the user in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@peaktech.com" },
  { $set: { role: "admin", emailVerified: true } }
)
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Verify network access if using MongoDB Atlas

### Email Not Sending
- Check email credentials in `.env.local`
- For Gmail, use an App-Specific Password
- Enable "Less secure app access" or use OAuth2
- In development, OTP will be printed to console if email fails

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 Next Steps

- Configure Google OAuth credentials
- Set up payment processing (Stripe/PayPal)
- Add product image upload functionality
- Implement admin dashboard with analytics
- Add product reviews and ratings
- Set up email templates for order confirmations
- Deploy to production (Vercel, AWS, etc.)

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using Next.js and AI assistance
