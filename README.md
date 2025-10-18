# Neo Market (Referral & Credit System)

This is a full-stack application for a digital product platform called "Neo Market," implementing a referral and credit system. Users can register, log in, share referral links, earn credits on referred users' first purchases, and track their activity on a dashboard. The project demonstrates clean architecture, modern UI, and thoughtful engineering practices.

## Table of Contents
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Architecture & Business Logic](#architecture--business-logic)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [System Design Documentation](#system-design-documentation)
- [Optional Enhancements](#optional-enhancements)

## Features
- Secure user registration, login, and logout with authentication.
- Unique referral link generation for each user (e.g., `https://neo-market.com/register?r=USER123`).
- Earn 2 credits each for referrer and referred user on the first purchase.
- Dashboard to track referred users, converted users, and total credits.
- Purchase simulation with prevention of double-crediting.

## Setup Instructions
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/neo-market.git
   cd neo-market



   Install Dependencies:

Frontend: Navigate to client and run:
bashnpm install

Backend: Navigate to server and run:
bashnpm install



Configure Environment Variables: Create .env files in client and server directories using .env.example as a template.
Set Up Database:

Install a relational database (e.g., PostgreSQL) or use a cloud service.
Update the database URL in the .env file.


Run Migrations (if using Prisma):
bashnpx prisma migrate dev

Run the Application:

Start the backend server:
bashnpm start

Start the frontend:
bashnpm run dev



Access the App: Open http://localhost:3000 in your browser.

Environment Variables
Create .env files in both client and server directories based on .env.example. Example:

client/.env:
textNEXT_PUBLIC_API_URL=http://localhost:5000/api

server/.env:
textPORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/neo-market
JWT_SECRET=your-secret-key


API Endpoints

POST /api/auth/register: Register a new user.

Body: { name, email, password }


POST /api/auth/login: Log in a user.

Body: { email, password }


GET /api/user/referral: Get the user's referral link.
POST /api/referral/track: Track referral status.

Body: { referralCode }


POST /api/purchase: Simulate a purchase.

Body: { userId, productId }


GET /api/dashboard/:userId: Get dashboard metrics (referred users, converted users, credits).

Architecture & Business Logic

Frontend: Built with Next.js, TypeScript, and Tailwind CSS. Uses Zustand for state management and Framer Motion for animations. The UI features a responsive, modern dashboard.
Backend: Node.js with Express and TypeScript. Implements RESTful APIs with JWT authentication. Manages referral tracking and credit allocation.
Database: Relational database (e.g., PostgreSQL) with a custom schema designed for users, referrals, purchases, and dashboards.
Business Logic:

Users receive a unique referral link upon registration.
When a referred user signs up and makes their first purchase, both earn 2 credits.
Subsequent purchases do not generate additional credits.
Dashboard updates reflect real-time user activity.



Technologies Used

Frontend: Next.js, TypeScript, Tailwind CSS, Zustand, Framer Motion
Backend: Node.js, Express, TypeScript
Database: PostgreSQL (or equivalent relational DB)
ORM: Prisma (for schema management and migrations)
Authentication: JWT (or Clerk/Supabase Auth)

Deployment

Deployed using Vercel (frontend) and Render (backend). Live demo: https://neo-market.vercel.app

System Design Documentation
Database Schema (DBML)
dbml// DBML Schema for Neo Market

Table users {
  id string [primary key]
  name varchar
  email varchar [unique]
  password varchar
  referral_code varchar [unique]
  image varchar
  is_email_verified boolean [default: false]
  role varchar [default: 'USER', note: 'ADMIN or USER']
  is_pro_member boolean [default: false]
  credits integer [default: 0]
  created_at timestamp
  updated_at timestamp
}

Table referrals {
  id string [primary key]
  referrer_id string [not null]
  referred_id string [not null]
  referral_code varchar
  status varchar [default: 'pending', note: 'pending or converted']
  converted_at timestamp
  purchase_id string [unique]
  created_at timestamp
}

Table purchases {
  id string [primary key]
  user_id string [not null]
  product_id varchar
  amount float
  is_first_purchase boolean [default: true]
  purchase_date timestamp
  referral_id string [unique]
}

Table dashboards {
  id string [primary key]
  user_id string [unique, not null]
  referred_users integer [default: 0]
  converted_users integer [default: 0]
  total_credits integer [default: 0]
}

// Foreign key relationships
Ref: users.id > referrals.referrer_id // one-to-many (a user can give many referrals)
Ref: users.id > referrals.referred_id // one-to-many (a user can be referred by many)
Ref: referrals.purchase_id > purchases.id // one-to-one (a referral may have one purchase)
Ref: users.id > purchases.user_id // one-to-many (a user can have many purchases)
Ref: purchases.referral_id > referrals.id // one-to-one (a purchase may be linked to one referral)
Ref: users.id > dashboards.user_id // one-to-one (a user has one dashboard)
UML Class Diagram
mermaidclassDiagram
    class User {
        -id: string
        -name: varchar
        -email: varchar
        -password: varchar
        -referral_code: varchar
        -credits: integer
        +register(): boolean
        +generateReferralLink(): string
        +earnCredits(amount: integer): void
    }
    class Referral {
        -id: string
        -referrer_id: string
        -referred_id: string
        -status: varchar
        -purchase_id: string
        +trackStatus(): string
        +convertReferral(): void
    }
    class Purchase {
        -id: string
        -user_id: string
        -product_id: varchar
        -amount: float
        -isFirstPurchase: boolean
        +processPurchase(): boolean
    }
    class Dashboard {
        -id: string
        -user_id: string
        -referred_users: integer
        -converted_users: integer
        -total_credits: integer
        +displayStats(): void
    }

    User "1" -- "*" Referral : has many
    Referral "1" -- "1" User : referrer
    Referral "1" -- "1" User : referred
    User "1" -- "*" Purchase : has many
    Referral "0..1" -- "1" Purchase : has
    User "1" -- "1" Dashboard : has