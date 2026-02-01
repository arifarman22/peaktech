# PeakTech E-Commerce Platform

## 📋 Project Overview

PeakTech is a modern, full-stack e-commerce platform built with cutting-edge technologies, designed for selling electronics and machinery products. The application features a decoupled architecture with a Next.js frontend and Express.js backend, providing a seamless shopping experience with robust admin management capabilities.

## 🎯 Key Features

### Customer Features
- **User Authentication**: Secure JWT-based authentication with email verification
- **Product Browsing**: Advanced filtering by category, price range, and product attributes
- **Product Sections**: Trending products, best sellers, and top-rated items
- **Wishlist System**: Save favorite products for later purchase
- **Shopping Cart**: Real-time cart management with quantity updates
- **Checkout Process**: Multi-step checkout with shipping address and payment options
- **Order Management**: View order history, track status, and cancel pending orders
- **User Profile**: Comprehensive dashboard with account info, order stats, and settings
- **Quick View**: Product preview modal for faster browsing
- **Search Functionality**: Real-time product search with filters

### Admin Features
- **Admin Dashboard**: Analytics with sales, orders, products, and user statistics
- **Product Management**: Full CRUD operations with image upload (Cloudinary integration)
- **Category Management**: Organize products into hierarchical categories
- **Order Management**: View, update order status, and manage customer orders
- **User Management**: View and manage customer accounts
- **Banner Management**: Create promotional banners for homepage
- **Coupon System**: Create and manage discount coupons
- **Inventory Tracking**: Monitor stock levels and product availability

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Load Balancing**: PM2 and Nginx configurations for scalability
- **Rate Limiting**: API protection against abuse
- **Image Optimization**: Cloudinary integration for efficient media handling
- **Email Service**: Resend integration for transactional emails
- **Database Seeding**: Sample data generation for testing
- **Error Handling**: Comprehensive error management and validation
- **Security**: Helmet.js, CORS, JWT tokens, password hashing

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Nunito Sans
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper
- **Routing**: Next.js App Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **File Upload**: Cloudinary
- **Email**: Resend
- **Security**: Helmet, CORS, bcryptjs
- **Rate Limiting**: express-rate-limit

### DevOps & Deployment
- **Deployment**: Vercel (Frontend & Backend)
- **Database Hosting**: MongoDB Atlas
- **Load Balancer**: Nginx
- **Process Manager**: PM2
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## 📁 Project Structure

```
PeakTech-E-Commerce/
├── frontend/                 # Next.js Application
│   ├── app/                 # Pages and routes
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout process
│   │   ├── orders/         # Order history
│   │   ├── profile/        # User profile
│   │   ├── products/       # Product pages
│   │   ├── shop/           # Product listing
│   │   ├── wishlist/       # Wishlist page
│   │   └── page.tsx        # Homepage
│   ├── components/          # Reusable UI components
│   └── lib/                # Utilities and contexts
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helpers and middleware
│   │   ├── config/         # Configuration files
│   │   └── scripts/        # Database seeding
│   └── .env                # Environment variables
│
├── nginx.conf              # Load balancer config
├── ecosystem.config.js     # PM2 configuration
├── docker-compose.yml      # Docker setup
└── README.md              # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Resend account (for emails)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/peaktech-ecommerce.git
cd peaktech-ecommerce
```

2. **Backend Setup**
```bash
cd backend
npm install
# Configure .env file
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
# Configure .env.local
npm run dev
```

4. **Seed Database** (Optional)
```bash
cd backend
npm run seed
```

### Default Admin Credentials
- Email: admin@peaktech.com
- Password: admin123456

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - List products (with filters)
- GET `/api/products/:slug` - Get single product
- POST `/api/products` - Create product (admin)
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

### Cart & Orders
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add to cart
- DELETE `/api/cart` - Clear cart
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- DELETE `/api/orders/:id` - Cancel order

### Wishlist
- GET `/api/wishlist` - Get wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist/:productId` - Remove from wishlist

## 💰 Currency

All prices are displayed in Bangladeshi Taka (৳ BDT)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation with Zod
- XSS protection
- SQL injection prevention

## 📊 Performance Optimizations

- Image optimization via Cloudinary
- Lazy loading for images
- Code splitting with Next.js
- API response caching
- Database indexing
- Load balancing support

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive grid layouts
- Interactive hover effects
- Category icons with emojis
- Hero slider with auto-rotation
- Product quick view modal
- Sticky navigation bar

## 📦 Deployment

The application is configured for deployment on Vercel with:
- Automatic builds and deployments
- Environment variable management
- Serverless function support
- CDN integration
- SSL certificates

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Developed by Arif Arman

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- Cloudinary for image management
- Vercel for hosting platform
- All open-source contributors

## 📞 Support

For support, email support@peaktech.com or open an issue in the repository.

---

**Live Demo**: https://peaktech-ecommerce.vercel.app

**Backend API**: https://peaktech-ecommerce.vercel.app/api

**Admin Panel**: https://peaktech-ecommerce.vercel.app/admin
