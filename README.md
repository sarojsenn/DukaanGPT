# DukaanGPT 🥘

*AI-Powered Supply Chain Platform for India's Street Food Vendors*

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)

> Empowering India's street vendors with AI-powered supply chain solutions through WhatsApp integration and voice-first technology.

## 🌟 *Live Demo*
- *Website*: https://dukaan-gpt-eiaq.vercel.app/
- *GitHub*: https://github.com/Innovata07/DukaanGPT

---

## 📋 *Table of Contents*
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage Workflow](#-usage-workflow)
- [API Endpoints](#-api-endpoints)
- [Authentication System](#-authentication-system)
- [Database Schema](#-database-schema)
- [UI Components](#-ui-components)
- [Team](#-team)
- [Contributing](#-contributing)

---

## ✨ *Features*

### 🎤 *Voice Order Processing*
- *Voice-to-text conversion* using Gemini AI
- *Local language support* (Hindi, English, regional languages)
- *WhatsApp integration* for seamless ordering
- *AI-powered order structuring* from voice notes

### 🤖 *Smart Supplier Matching*
- *AI-driven supplier recommendations* based on:
  - Geographic proximity
  - Product availability
  - Pricing competitiveness
  - Supplier ratings and reviews
- *Real-time inventory tracking*
- *Trust score calculation*

### 🤝 *Vendor Collaboration*
- *Group buying functionality* for bulk orders
- *Cost reduction through collective purchasing*
- *Community-driven supplier verification*
- *Shared logistics coordination*

### 💳 *Micro-Credit & Digital Ledger*
- *Financial tracking system* for vendors
- *Credit scoring* based on transaction history
- *Digital payment integration*
- *Expense and revenue analytics*

### 📱 *WhatsApp Integration*
- *Voice message processing*
- *Order confirmation and tracking*
- *Supplier communication*
- *Real-time notifications*

### 🔐 *JWT Authentication*
- *Secure user registration and login*
- *Role-based access control* (Vendor, Supplier, Customer)
- *Session management*
- *Protected routes*

---

## 🛠 *Tech Stack*

### *Frontend*
- *Next.js 15* - React framework with App Router
- *TypeScript* - Type-safe development
- *Tailwind CSS* - Utility-first CSS framework
- *Lucide React* - Beautiful icon library
- *Shadcn/ui* - Modern UI components

### *Backend*
- *Next.js API Routes* - Serverless API endpoints
- *MongoDB* - NoSQL database with Mongoose ODM
- *JWT* - JSON Web Token authentication
- *bcryptjs* - Password hashing

### *AI & Integration*
- *Google Gemini AI* - Voice processing and text generation
- *Twilio* - WhatsApp Business API integration
- *Speech-to-Text* - Voice order conversion

### *Development Tools*
- *ESLint* - Code linting
- *Prettier* - Code formatting
- *Git* - Version control

---

## 📁 *Project Structure*


studio-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── login/     # Login API
│   │   │   │   ├── signup/    # Registration API
│   │   │   │   ├── logout/    # Logout API
│   │   │   │   └── me/        # Get current user
│   │   │   └── users/         # User management
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── community/         # Community features
│   │   ├── learning/          # Learning modules
│   │   ├── inventory/         # Inventory management
│   │   ├── suppliers/         # Supplier directory
│   │   ├── finance/           # Financial tools
│   │   ├── tools/             # Utility tools
│   │   ├── barter/            # Barter system
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Shadcn)
│   │   ├── site-header.tsx   # Navigation header
│   │   ├── site-footer.tsx   # Footer component
│   │   ├── chatbot.tsx       # AI chatbot
│   │   ├── image-carousel.tsx # Hero image slider
│   │   ├── camera-capture.tsx # Camera functionality
│   │   ├── protected-route.tsx # Route protection
│   │   └── theme-provider.tsx # Theme management
│   ├── context/               # React Context providers
│   │   ├── auth-context.tsx  # Authentication state
│   │   └── translation-context.tsx # i18n support
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-toast.tsx     # Toast notifications
│   │   └── use-translation.tsx # Translation hook
│   ├── lib/                   # Utility libraries
│   │   ├── mongodb.ts        # Database connection
│   │   ├── jwt.ts            # JWT utilities
│   │   ├── models/           # Database models
│   │   │   └── User.ts       # User schema
│   │   └── utils.ts          # Helper functions
│   ├── ai/                    # AI-related functionality
│   │   └── flows/            # AI workflow modules
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
│   ├── images/               # Local images
│   │   ├── Dukaandaar.jpg    # Hero image 1
│   │   ├── dukaandar2.jpg    # Hero image 2
│   │   ├── dukaandar3.jpg    # Hero image 3
│   │   └── learning.jpg      # Learning section image
│   └── favicon.ico           # Site favicon
├── docs/                     # Documentation
│   └── blueprint.md          # Project blueprint
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind configuration
├── next.config.ts           # Next.js configuration
└── README.md                # Project documentation


---

## 🚀 *Installation*

### *Prerequisites*
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Git installed

### *1. Clone the Repository*
bash
git clone (https://github.com/sarojsenn/DukaanGPT.git)
cd DukaanGPT


### *2. Install Dependencies*
bash
npm install


### *3. Environment Setup*
Create a .env file in the root directory:

env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Twilio Configuration (WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_REAL_ACCOUNT_SID=your_real_account_sid

# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/dukaangpt

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d


### *4. Start Development Server*
bash
npm run dev


The application will be available at http://localhost:3000

---

## 🔧 *Environment Setup*

### *Required API Keys*

1. *Google Gemini AI API*
   - Visit: https://makersuite.google.com/app/apikey
   - Create API key for voice processing

2. *Twilio (WhatsApp Business API)*
   - Sign up at: https://www.twilio.com/
   - Get Account SID, Auth Token, and Phone Number

3. *MongoDB*
   - Local: Install MongoDB Community Edition
   - Cloud: Create free cluster at MongoDB Atlas

---

## 📱 *Usage Workflow*

### *For Street Food Vendors*

1. *Registration & Onboarding*
   
   Visit → Signup → Fill Business Details → Verify Account → Dashboard Access
   

2. *Voice Order Placement*
   
   WhatsApp → Send Voice Message → AI Processing → Order Structured → Supplier Matching
   

3. *Supplier Discovery*
   
   Browse Suppliers → View Ratings → Check Proximity → Compare Prices → Connect
   

4. *Group Buying*
   
   Join Groups → Bulk Orders → Cost Savings → Shared Logistics
   

5. *Financial Management*
   
   Track Expenses → Monitor Revenue → Access Credit → Digital Payments
   

### *For Suppliers*

1. *Business Setup*
   
   Register → Upload Inventory → Set Pricing → Define Service Areas
   

2. *Order Management*
   
   Receive Orders → Confirm Availability → Update Inventory → Track Deliveries
   

3. *Community Building*
   
   Build Trust Score → Collect Reviews → Expand Network
   

---

## 🔌 *API Endpoints*

### *Authentication*
typescript
POST /api/auth/signup     # User registration
POST /api/auth/login      # User login
POST /api/auth/logout     # User logout
GET  /api/auth/me         # Get current user


### *User Management*
typescript
GET    /api/users         # Get all users
GET    /api/users/[id]    # Get user by ID
PUT    /api/users/[id]    # Update user
DELETE /api/users/[id]    # Delete user


### *Orders* (Planned)
typescript
POST /api/orders          # Create order
GET  /api/orders          # Get user orders
PUT  /api/orders/[id]     # Update order


### *Suppliers* (Planned)
typescript
GET  /api/suppliers       # Get suppliers
POST /api/suppliers/match # AI supplier matching


---

## 🔐 *Authentication System*

### *User Types*
- *Vendors*: Street food entrepreneurs
- *Suppliers*: Raw material providers  
- *Customers*: End consumers

### *JWT Implementation*
typescript
// Token Structure
{
  userId: string,
  email: string,
  role: 'vendor' | 'supplier' | 'customer',
  iat: number,
  exp: number
}


### *Protected Routes*
- Dashboard access requires authentication
- Role-based feature access
- Automatic token refresh

---

## 🗄 *Database Schema*

### *User Model*
typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  phone?: string,
  businessName?: string,
  businessType: 'vendor' | 'supplier' | 'customer',
  location?: string,
  isVerified: boolean,
  trustScore: number,
  createdAt: Date,
  updatedAt: Date
}


### *Future Models* (Planned)
- *Orders*: Order tracking and management
- *Products*: Inventory and catalog
- *Suppliers*: Supplier profiles and ratings
- *Transactions*: Financial records

---

## 🎨 *UI Components*

### *Custom Components*
- *ImageCarousel*: Auto-sliding hero carousel with dots navigation
- *ChatBot*: AI-powered assistance
- *CameraCapture*: Image capture functionality
- *ProtectedRoute*: Authentication wrapper

### *Shadcn/ui Components*
- *Cards*: Content containers
- *Buttons*: Interactive elements  
- *Forms*: Input handling
- *Navigation*: Menu systems
- *Modals*: Overlay dialogs

---

## 👥 *Team*

*Developed for India's Street Vendors by:*

| Name | Role | LinkedIn |
|------|------|----------|
| *Anudip Saha* | Full-Stack Developer | [LinkedIn](https://www.linkedin.com/in/anudip-saha-76ab33309/) |
| *Saroj Sen* | Full-Stack Developer | [LinkedIn](https://www.linkedin.com/in/saroj-sen-227549318/) |
| *Soumyajit Bag* | Full-Stack Developer | [LinkedIn](http://www.linkedin.com/in/soumyajit-bag-0b234a322) |

---

## 🎯 *Hackathon Features*

### *Completed Features*
- ✅ Complete authentication system with JWT
- ✅ MongoDB integration with user management
- ✅ Professional UI with image carousel
- ✅ Voice order processing framework
- ✅ Supplier matching algorithm foundation
- ✅ WhatsApp integration setup
- ✅ Responsive design for all devices
- ✅ Team section with professional links

### *Demo-Ready Components*
- ✅ Working login/signup flow
- ✅ Protected dashboard areas
- ✅ AI-powered chatbot interface
- ✅ Professional landing page
- ✅ Learning modules with video content

---

## 🚀 *Deployment*

### *Vercel Deployment* (Recommended)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod


### *Environment Variables for Production*
- Add all .env variables to Vercel dashboard
- Use MongoDB Atlas for production database
- Configure domain and SSL

---

## 🤝 *Contributing*

1. Fork the repository
2. Create feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open Pull Request

---

## 📄 *License*

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 *Acknowledgments*

- *Google Gemini AI* for voice processing capabilities
- *Twilio* for WhatsApp Business API
- *MongoDB* for reliable database solutions
- *Vercel* for seamless deployment
- *India's Street Food Community* for inspiration

---

## 📞 *Support*

For support, email: sarojsen2009@gmail.com or join our community discussions.

---

<p align="center">
  <strong>Built with ❤ for India's Street Vendors</strong><br>
  <em>Empowering small businesses through technology</em>
</p>

---

*Repository*: https://github.com/Innovata07/DukaanGPT
*Live Demo*: https://dukaan-gpt-eiaq.vercel.app/
