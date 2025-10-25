# FileSure Assignment - Referral & Credit System

A full-stack referral and credit system built with Node.js, Express, TypeScript, and MongoDB using Prisma ORM.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration, login, and email verification with OTP
- **Referral System**: Users can share referral links and earn credits when referrals make purchases
- **Credit System**: Both referrer and referred user earn 2 credits on first purchase
- **Purchase Simulation**: Demo purchase functionality for testing the credit system
- **Dashboard Analytics**: Comprehensive dashboard showing referral statistics and earnings
- **Email Notifications**: Automated email notifications for referral bonuses and welcome messages

### Business Logic
- Each user gets a unique referral code upon registration
- When a user signs up via referral link, the referrer-referred relationship is recorded
- Credits are awarded only on the **first purchase** by a referred user
- Both referrer and referred user earn **2 credits each** on conversion
- Prevention of double-crediting through proper transaction handling

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma ORM** with **MongoDB**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation
- **Morgan** for logging

### Architecture
- **Class-based services** for better organization and maintainability
- **Modular structure** with separate modules for auth, users, referrals, and purchases
- **RESTful API design** with proper HTTP status codes
- **Transaction-based operations** for data consistency
- **Comprehensive error handling** with custom error classes

## 📁 Project Structure

```
src/
├── app/
│   ├── errors/           # Custom error handling
│   ├── helpers/          # Utility functions
│   ├── interface/        # TypeScript interfaces
│   ├── lib/             # Database and external service configurations
│   ├── middlewares/     # Authentication and validation middlewares
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── user/        # User management module
│   │   ├── referral/    # Referral system module
│   │   └── purchase/    # Purchase and credit system module
│   ├── routes/          # Main route configuration
│   ├── shared/          # Shared utilities
│   └── utils/           # Email and notification utilities
├── config/              # Configuration files
└── types/               # Global type definitions
```

## Diagram

[FigJam Diagram](https://www.figma.com/board/UZ9sby0OhYHrE3xBgL94Ug/NeoMarket?node-id=1-840&p=f&t=67DXdg1bsEp5DBs2-0)

<img src="https://i.ibb.co.com/BV1v6xz4/Neo-Market.png" alt="App Diagram" width="600" />


## 🗄️ Database Schema


# Schema Architecture Diagram 

<img src="https://raw.githubusercontent.com/mdabdulkyum1/neo-market-server/refs/heads/main/docs/diagram.svg" alt="Diagram" width="600">



### User Model
- Basic user information (name, email, password)
- Unique referral code for sharing
- Credits balance
- Email verification status

### Referral Model
- Referrer-referred relationship tracking
- Referral status (PENDING/CONVERTED)
- Conversion timestamp
- Link to associated purchase

### Purchase Model
- Purchase details (user, product, amount)
- First purchase flag for credit eligibility
- Referral relationship (if applicable)

### Dashboard Model
- Aggregated statistics for each user
- Total referred users count
- Converted users count
- Total credits earned

### OTP Model
- Email verification and password reset OTPs
- Expiration handling

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /create-account` - Register new user with optional referral code
- `POST /email-verify` - Verify email with OTP
- `POST /login` - User login
- `POST /admin/login` - Admin login
- `POST /forgot-password` - Request password reset OTP
- `POST /reset-password` - Reset password with OTP
- `POST /change-password` - Change password (authenticated)
- `POST /resend-otp` - Resend OTP

### Users (`/api/users`)
- `GET /me` - Get current user profile
- `PUT /update-profile` - Update user profile
- `POST /me/uploads-profile-photo` - Upload profile image
- `GET /dashboard` - Get user dashboard data
- `GET /referrals/history` - Get referral history
- `GET /:id` - Get user by ID
- `GET /all` - Get all users (admin)
- `PUT /status/:userId` - Update user status (admin)
- `DELETE /delete/:id` - Delete user (admin)

### Referrals (`/api/referrals`)
- `GET /stats` - Get referral statistics (authenticated)
- `GET /validate/:referralCode` - Validate referral code (public)
- `GET /leaderboard` - Get referral leaderboard (public)

### Purchases (`/api/purchases`)
- `POST /` - Create purchase (authenticated)
- `POST /simulate` - Simulate purchase for demo (authenticated)
- `POST /payment-intent` - Create Stripe payment intent (authenticated)
- `POST /confirm-payment` - Confirm Stripe payment and process purchase (authenticated)
- `GET /history` - Get purchase history (authenticated)
- `GET /:id` - Get purchase by ID (authenticated)
- `GET /stats/overview` - Get purchase statistics (authenticated)
- `GET /admin/all` - Get all purchases (admin)

### Email Testing (`/api/email`) - Development Only
- `POST /test/referral-bonus` - Test referral bonus email (authenticated)
- `POST /test/welcome` - Test welcome email (authenticated)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neo-market-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL="mongodb://localhost:27017/referral-system"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="7d"
   BCRYPT_SALT_ROUNDS=12
   FRONTEND_URL="http://localhost:3000"
   
   # Email Configuration
   EMAIL="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   CONTACT_MAIL_ADDRESS="contact@neomarket.com"
   
   # Stripe Configuration
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 🧪 Testing the System

### 1. User Registration with Referral
```bash
# Register first user (no referral)
POST /api/auth/create-account
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Register second user with referral
POST /api/auth/create-account
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "referralCode": "REF123ABC456" // John's referral code
}
```

### 2. Make Purchase (Simulate)
```bash
# First purchase by Jane (triggers referral credits)
POST /api/purchases/simulate
{
  "productName": "Digital Product",
  "amount": 29.99
}
```

### 3. Check Dashboard
```bash
# Get John's dashboard to see referral earnings
GET /api/users/dashboard
```

### 4. Test Email Notifications
```bash
# Test referral bonus email
POST /api/email/test/referral-bonus
{
  "email": "test@example.com",
  "name": "Test User",
  "credits": 2
}

# Test welcome email
POST /api/email/test/welcome
{
  "email": "test@example.com",
  "name": "Test User"
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Rate Limiting**: Built-in Express rate limiting
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📊 Business Logic Implementation

### Referral Flow
1. User A registers and receives referral code
2. User A shares referral link: `https://yourapp.com/register?r=REF123ABC456`
3. User B registers using User A's referral code
4. User B makes their first purchase
5. Both User A and User B receive 2 credits each
6. User A's dashboard shows increased referral count and earnings

### Email Notification System
1. **Welcome Email**: Sent when user completes email verification
2. **Referral Bonus Email**: Sent to both referrer and referred user when credits are awarded
3. **Signup Bonus Email**: Sent to users who make their first purchase without a referral
4. **Email Templates**: Beautiful, responsive HTML templates with Neo Market branding

### Credit System
- Credits are awarded only on **first purchase** by referred users
- Both referrer and referred user earn **2 credits each**
- No double-crediting through transaction-based operations
- Credits are tracked in both user records and dashboard aggregates

## 🎯 Assignment Requirements Compliance

✅ **User & Authentication**: Secure registration, login, logout with NextAuth by JWT
✅ **Referral Management**: Unique referral codes, relationship tracking
✅ **Purchases**: Purchase simulation with credit rewards
✅ **User Dashboard**: Complete analytics and referral tracking
✅ **Data Integrity**: Transaction-based operations prevent double-crediting
✅ **Class-based Services**: All services use class architecture
✅ **TypeScript**: Full type safety throughout the application
✅ **RESTful APIs**: Well-structured API endpoints
✅ **Error Handling**: Comprehensive error management
✅ **Security**: Hashed passwords, secure tokens, input validation

## 📝 API Documentation

For detailed API documentation, you can use tools like Postman or create a Swagger/OpenAPI specification. All endpoints follow RESTful conventions with proper HTTP status codes and response formats.

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run lint` - Run ESLint

### Database Commands
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client

