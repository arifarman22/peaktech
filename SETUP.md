# Setup Guide

## ✅ Completed
- MongoDB connected locally
- Admin user created (admin@peaktech.com / admin123456)
- 5 Categories seeded
- 5 Sample products seeded
- Full admin panel with CRUD operations

## 🔧 Optional Configuration

### 1. Cloudinary Setup (for image uploads)

1. Sign up at https://cloudinary.com (free tier available)
2. Get your credentials from Dashboard
3. Update `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Restart backend server

**Without Cloudinary:** You can still use direct image URLs in products.

### 2. Email Service Setup (for OTP verification)

#### Option A: Gmail
1. Enable 2-Factor Authentication on your Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `backend/.env`:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   EMAIL_FROM=PeakTech <noreply@peaktech.com>
   ```

#### Option B: Other Services
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://mailgun.com
- **AWS SES**: https://aws.amazon.com/ses

**Without Email:** Registration will still work but OTP verification will be skipped.

## 🚀 Running the Project

### Backend
```bash
cd backend
npm run dev
```
Runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:3000

## 📱 Access Points

- **Homepage**: http://localhost:3000
- **Shop**: http://localhost:3000/shop
- **Admin Panel**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

## 🔐 Admin Credentials
- Email: admin@peaktech.com
- Password: admin123456

## 📦 Seeded Data
- **Categories**: Smartphones, Laptops, Tablets, Accessories, Audio
- **Products**: iPhone 15 Pro, MacBook Pro, iPad Pro, AirPods Pro, Magic Keyboard

## 🎯 Next Steps
1. Login as admin
2. Explore admin dashboard
3. Add more products/categories
4. Test user registration and shopping flow
5. Configure Cloudinary for custom image uploads (optional)
6. Set up email service for OTP (optional)
