# WorkSure – Integrated Service Provider All-in-One Platform

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://worksure-bd.web.app/)
[![Frontend](https://img.shields.io/badge/frontend-GitHub-blue.svg)](https://github.com/Armankabirr/Worksure)
[![Backend](https://img.shields.io/badge/backend-GitHub-orange.svg)](https://github.com/paradox-99/WorkSure_Backend)

## 📋 Project Overview

**WorkSure** is a comprehensive web and mobile-based service marketplace that bridges the gap between users and verified household and personal service providers. The platform revolutionizes how people access essential services by providing a trusted, transparent, and secure ecosystem for hiring professional workers.

### Problem Statement

In today's fast-paced world, finding reliable, verified service providers for household and personal needs is challenging. Traditional methods lack transparency, accountability, and security. WorkSure addresses these pain points by:

- Eliminating the uncertainty of worker credibility through rigorous verification
- Providing transparent pricing and service details
- Ensuring secure payment mechanisms
- Building trust through user reviews and ratings
- Offering a seamless booking experience

### Target Users

- **Clients**: Individuals and households seeking professional service providers
- **Workers**: Verified service professionals looking to connect with clients
- **Admins**: Platform managers overseeing operations, verification, and analytics

---

## ✨ Key Features

### For Clients
- 🔐 **User Authentication & Profile Management**: Secure registration, login, and profile customization
- 🔍 **Advanced Search & Filtering**: Find services by category, location, rating, price, and availability
- 📅 **Service Booking System**: Easy-to-use booking interface with date and time selection
- 💳 **Secure Online Payments**: Multiple payment options including bKash, Nagad, credit/debit cards
- ⭐ **Rating & Review System**: Share experiences and read authentic reviews from other users
- 📊 **Transaction History**: Complete record of bookings, payments, and invoices
- 🔔 **Real-time Notifications**: Updates on booking status, worker arrival, and promotions
- 🛒 **Shopping Cart**: Add multiple services and checkout seamlessly

### For Workers
- ✅ **Worker Verification System**: Multi-step verification process including ID verification and background checks
- 📱 **Worker Dashboard**: Manage bookings, track earnings, and update availability
- 💰 **Transparent Payment Tracking**: View earnings, pending payments, and transaction history
- 📈 **Performance Analytics**: Monitor ratings, completed jobs, and customer feedback
- 📋 **Service Management**: Update service offerings, pricing, and availability

### For Admins
- 👥 **User Management**: Oversee client and worker accounts
- ✔️ **Worker Verification Control**: Approve or reject worker applications
- 📊 **Analytics Dashboard**: Platform usage statistics, revenue tracking, and performance metrics
- 💼 **Service Management**: Add, edit, or remove service categories
- 🚨 **Complaint Handling**: Review and resolve user complaints
- 📧 **Notification Management**: Send announcements and updates to users

---

## 🏗️ System Architecture Overview

WorkSure follows a modern, scalable, and maintainable architecture:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Frontend       │◄───────►│  Backend API    │◄───────►│   Database      │
│  (React/Vite)   │  REST   │  (Node.js)      │         │  (PostgreSQL)   │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           
        │                           │                           
        ▼                           ▼                           
┌─────────────────┐         ┌─────────────────┐         
│                 │         │                 │         
│  Firebase       │         │  Payment        │         
│  Hosting        │         │  Gateway        │         
│                 │         │                 │         
└─────────────────┘         └─────────────────┘         
```

### Architecture Principles

- **API-Driven Design**: RESTful API architecture for scalability and flexibility
- **Role-Based Access Control (RBAC)**: Granular permissions for User, Worker, and Admin roles
- **Microservices Ready**: Modular design allowing future service separation
- **Security First**: End-to-end encryption, secure authentication, and data protection
- **Responsive Design**: Mobile-first approach ensuring seamless experience across devices

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Styling**: Tailwind CSS, PostCSS
- **Deployment**: Firebase Hosting

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript/TypeScript
- **API Architecture**: RESTful

### Database
- **Primary Database**: PostgreSQL
- **ORM**: Prisma (if applicable)
- **Caching**: Redis (for session management and performance optimization)

### Authentication & Security
- **Authentication**: Firebase Authentication / JWT-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Password Encryption**: bcrypt
- **API Security**: Helmet.js, CORS configuration

### Payment Integration
- **Mobile Wallets**: bKash, Nagad
- **Cards**: SSL Commerz / Stripe integration
- **Payment Processing**: Secure payment gateway integration

### Notifications
- **Real-time Updates**: WebSockets / Firebase Cloud Messaging
- **Email**: Nodemailer
- **SMS**: Twilio / Local SMS gateway

### Development & Deployment
- **Version Control**: Git, GitHub
- **Package Manager**: npm / bun
- **Linting**: ESLint
- **Hosting**: 
  - Frontend: Firebase Hosting
  - Backend: Cloud hosting (AWS / DigitalOcean / Heroku)
- **CI/CD**: GitHub Actions

---

## 👤 User Roles

### 1. Client (Service Consumer)
**Responsibilities**:
- Browse and search for services
- Book service providers
- Make secure payments
- Rate and review workers
- Manage personal profile and preferences
- Track booking history and transactions

**Access Level**: Standard user permissions

### 2. Worker (Service Provider)
**Responsibilities**:
- Complete profile verification process
- List available services with pricing
- Accept or decline booking requests
- Update availability and service details
- Receive payments for completed work
- Maintain professional ratings

**Access Level**: Worker-specific dashboard and features

### 3. Admin (Platform Manager)
**Responsibilities**:
- Verify and approve worker applications
- Monitor platform activities and analytics
- Manage service categories and pricing guidelines
- Handle dispute resolution and complaints
- Send platform-wide notifications
- Generate reports and insights

**Access Level**: Full platform access with administrative privileges

---

## 📦 Core Modules

### 1. User Management Module
- User registration and authentication
- Profile creation and editing
- Password reset and recovery
- Account deactivation/deletion
- Preference settings

### 2. Worker Management & Verification Module
- Worker registration and onboarding
- Multi-step verification process:
  - Identity verification (NID/Passport)
  - Background check
  - Skills assessment
  - Reference validation
- Document upload and storage
- Verification status tracking
- Worker profile management

### 3. Service Booking Module
- Service catalog browsing
- Search and filter functionality
- Service detail viewing
- Booking creation with date/time selection
- Booking modification and cancellation
- Booking status tracking
- Calendar integration

### 4. Payment Management Module
- Multiple payment method support
- Secure payment processing
- Payment confirmation and receipts
- Refund handling
- Transaction history
- Invoice generation
- Wallet integration (for future enhancements)

### 5. Review & Rating Module
- Worker rating system (1-5 stars)
- Written reviews and feedback
- Review moderation
- Rating aggregation and display
- Verified purchase badges
- Helpful review voting

### 6. Notification System
- Real-time push notifications
- Email notifications
- SMS alerts (for critical updates)
- In-app notification center
- Notification preferences management
- Event-driven notification triggers

### 7. Admin Panel Module
- Dashboard with key metrics
- User and worker management
- Service category management
- Verification workflow
- Complaint and dispute management
- Analytics and reporting
- Content management
- Platform configuration

---

## 🚀 Installation & Setup (Developer Guide)

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- npm or bun package manager
- PostgreSQL (v14 or higher)
- Git

### Environment Variables

Create a `.env` file in both frontend and backend directories:

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/worksure
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Payment Gateway
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
NAGAD_MERCHANT_ID=your_nagad_merchant_id
NAGAD_MERCHANT_KEY=your_nagad_merchant_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Firebase Admin
FIREBASE_ADMIN_SDK_PATH=./serviceAccountKey.json

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Armankabirr/Worksure.git
cd Worksure

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Clone the backend repository
git clone https://github.com/paradox-99/WorkSure_Backend.git
cd WorkSure_Backend

# Install dependencies
npm install

# Set up database
# Create PostgreSQL database
createdb worksure

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

The backend API will be available at `http://localhost:5000`

### Database Setup

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE worksure;

# Run migrations using Prisma
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Running the Complete Project

1. Start PostgreSQL database
2. Start backend server: `npm run dev` (in backend directory)
3. Start frontend development server: `npm run dev` (in frontend directory)
4. Access the application at `http://localhost:5173`

---

## 🔌 API Overview

### Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### User APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| GET | `/api/users/bookings` | Get user bookings | Yes |
| GET | `/api/users/transactions` | Get transaction history | Yes |

### Worker APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/workers/register` | Register as worker | Yes |
| GET | `/api/workers/:id` | Get worker details | No |
| PUT | `/api/workers/:id` | Update worker profile | Yes (Worker) |
| GET | `/api/workers/dashboard` | Get worker dashboard data | Yes (Worker) |
| GET | `/api/workers/earnings` | Get earnings summary | Yes (Worker) |

### Service APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/services` | Get all services | No |
| GET | `/api/services/:id` | Get service details | No |
| GET | `/api/services/category/:category` | Get services by category | No |
| POST | `/api/services` | Create service | Yes (Admin) |
| PUT | `/api/services/:id` | Update service | Yes (Admin) |
| DELETE | `/api/services/:id` | Delete service | Yes (Admin) |

### Booking APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/:id` | Get booking details | Yes |
| PUT | `/api/bookings/:id` | Update booking | Yes |
| DELETE | `/api/bookings/:id` | Cancel booking | Yes |
| PATCH | `/api/bookings/:id/status` | Update booking status | Yes (Worker/Admin) |

### Payment APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/initiate` | Initiate payment | Yes |
| POST | `/api/payments/confirm` | Confirm payment | Yes |
| GET | `/api/payments/:id` | Get payment details | Yes |
| POST | `/api/payments/refund` | Process refund | Yes (Admin) |

### Review APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Create review | Yes |
| GET | `/api/reviews/worker/:workerId` | Get worker reviews | No |
| PUT | `/api/reviews/:id` | Update review | Yes |
| DELETE | `/api/reviews/:id` | Delete review | Yes |

### Admin APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Get admin dashboard stats | Yes (Admin) |
| GET | `/api/admin/users` | Get all users | Yes (Admin) |
| GET | `/api/admin/workers/pending` | Get pending verifications | Yes (Admin) |
| PATCH | `/api/admin/workers/:id/verify` | Verify worker | Yes (Admin) |
| GET | `/api/admin/complaints` | Get all complaints | Yes (Admin) |
| PATCH | `/api/admin/complaints/:id` | Resolve complaint | Yes (Admin) |

### Complaint APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/complaints` | Submit complaint | Yes |
| GET | `/api/complaints/user` | Get user complaints | Yes |
| GET | `/api/complaints/:id` | Get complaint details | Yes |

---

## 🗄️ Database Overview

### Key Entities

#### Users
- User ID (Primary Key)
- Email, Password (hashed)
- Full Name, Phone Number
- Profile Picture
- Address
- Role (Client/Worker/Admin)
- Verification Status
- Created At, Updated At

#### Workers
- Worker ID (Primary Key)
- User ID (Foreign Key)
- Verification Status (Pending/Verified/Rejected)
- ID Document Type & Number
- Background Check Status
- Skills & Specializations
- Service Categories
- Hourly Rate / Service Pricing
- Availability Schedule
- Average Rating
- Total Jobs Completed

#### Services
- Service ID (Primary Key)
- Service Name
- Category (Cleaning, Electrician, Pet Care, etc.)
- Description
- Base Price
- Duration
- Image URLs
- Active Status

#### Bookings
- Booking ID (Primary Key)
- Client ID (Foreign Key to Users)
- Worker ID (Foreign Key to Workers)
- Service ID (Foreign Key to Services)
- Booking Date & Time
- Status (Pending/Confirmed/Completed/Cancelled)
- Total Amount
- Special Instructions
- Created At, Updated At

#### Payments
- Payment ID (Primary Key)
- Booking ID (Foreign Key)
- Amount
- Payment Method (bKash/Nagad/Card)
- Transaction ID
- Payment Status (Pending/Success/Failed/Refunded)
- Payment Date

#### Reviews
- Review ID (Primary Key)
- Booking ID (Foreign Key)
- Client ID (Foreign Key to Users)
- Worker ID (Foreign Key to Workers)
- Rating (1-5)
- Review Text
- Helpful Count
- Created At

#### Complaints
- Complaint ID (Primary Key)
- User ID (Foreign Key)
- Booking ID (Foreign Key, Optional)
- Complaint Type
- Description
- Status (Open/In Progress/Resolved)
- Admin Response
- Created At, Resolved At

### Relationships

- **Users ↔ Workers**: One-to-One (A user can become a worker)
- **Workers ↔ Bookings**: One-to-Many (A worker can have multiple bookings)
- **Clients ↔ Bookings**: One-to-Many (A client can create multiple bookings)
- **Bookings ↔ Payments**: One-to-One (Each booking has one payment)
- **Bookings ↔ Reviews**: One-to-One (Each completed booking can have one review)
- **Users ↔ Complaints**: One-to-Many (A user can submit multiple complaints)

---

## 🔒 Security Considerations

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit (SSL/TLS)
- **Password Security**: Passwords hashed using bcrypt with salt rounds
- **Database Security**: Parameterized queries to prevent SQL injection
- **XSS Prevention**: Input sanitization and output encoding
- **CSRF Protection**: CSRF tokens for state-changing operations

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with expiration
- **Role-Based Access Control**: Strict permission checks at API level
- **Session Management**: Secure session handling with timeout
- **Multi-Factor Authentication**: Optional 2FA for enhanced security (future)

### Worker Verification
- **Identity Verification**: National ID / Passport verification
- **Background Checks**: Criminal record verification
- **Document Verification**: Automated and manual document validation
- **Reference Checks**: Verification of professional references
- **Ongoing Monitoring**: Continuous rating and feedback tracking

### Payment Security
- **PCI DSS Compliance**: Payment gateway integration following standards
- **Tokenization**: Card details never stored on servers
- **Fraud Detection**: Transaction monitoring and anomaly detection
- **Secure Callbacks**: HMAC signature verification for payment callbacks
- **Audit Trail**: Complete payment transaction logging

### API Security
- **Rate Limiting**: Prevent API abuse and DDoS attacks
- **API Key Management**: Secure API key rotation
- **Input Validation**: Strict validation of all user inputs
- **Error Handling**: Generic error messages to prevent information leakage

---

## 🚀 Future Enhancements

### Short-term Goals
- [ ] **Mobile Application**: Native Android and iOS apps using React Native
- [ ] **Push Notifications**: Enhanced real-time notification system
- [ ] **Chat System**: In-app messaging between clients and workers
- [ ] **Booking Scheduler**: Advanced calendar integration
- [ ] **Multi-language Support**: Bangla and English language options

### Medium-term Goals
- [ ] **AI-Powered Recommendations**: Machine learning-based service suggestions
- [ ] **Dynamic Pricing**: Surge pricing based on demand
- [ ] **Location Tracking**: Real-time worker location during service
- [ ] **Video Call Integration**: Virtual consultation before booking
- [ ] **Subscription Plans**: Premium memberships with benefits
- [ ] **Loyalty Program**: Reward points and referral bonuses

### Long-term Goals
- [ ] **Automated Scheduling**: AI-optimized worker-client matching
- [ ] **Emergency Services**: 24/7 urgent service category
- [ ] **Service Quality AI**: Automated quality assurance using computer vision
- [ ] **Blockchain Integration**: Transparent payment and review system
- [ ] **IoT Integration**: Smart home service integration
- [ ] **Marketplace Expansion**: B2B services for corporate clients

---

## 📊 Project Status

**Current Status**: ✅ Active Development

This project is developed as part of an academic initiative for:
- **Institution**: United International University (UIU)
- **Course**: Software Engineering Laboratory (12th Trimester)
- **Purpose**: Educational project demonstrating full-stack development skills
- **Development Stage**: Beta / MVP

### Completed Milestones
✅ User authentication and authorization  
✅ Service listing and browsing  
✅ Booking system implementation  
✅ Worker dashboard  
✅ Admin panel basic features  
✅ Payment gateway integration  
✅ Review and rating system  
✅ Frontend deployment on Firebase  

### In Progress
🔄 Advanced search and filtering  
🔄 Real-time notifications  
🔄 Enhanced admin analytics  
🔄 Mobile responsive optimizations  

### Upcoming
📋 Comprehensive testing suite  
📋 Performance optimization  
📋 Documentation completion  
📋 Mobile app development  

---

## 👥 Contributors

This project is developed and maintained by a dedicated team of developers:

- **[Arman Kabir]** - Frontend Developer & UI/UX Designer
  - GitHub: [@Armankabirr](https://github.com/Armankabirr)
  
- **[Nayeem]** - Full Stack Developer
  - GitHub: [@paradox-99](https://github.com/paradox-99)

### Contributing

We welcome contributions from the community! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

---

## 📄 License

This project is developed for **academic and educational purposes**.

**License Type**: Academic / Educational Use

⚠️ **Important Notice**:
- This project is part of a university course assignment
- The code is made available for educational reference and learning
- Commercial use requires explicit permission from the authors
- If you use this project as a reference, please provide appropriate attribution

---

## 🔗 Important Links

- **Live Demo**: [https://worksure-bd.web.app/](https://worksure-bd.web.app/)
- **Frontend Repository**: [https://github.com/Armankabirr/Worksure](https://github.com/Armankabirr/Worksure)
- **Backend Repository**: [https://github.com/paradox-99/WorkSure_Backend](https://github.com/paradox-99/WorkSure_Backend)

---

## 📞 Contact & Support

For questions, suggestions, or issues:

- **GitHub Issues**: Please use the Issues section in the respective repositories
- **Email**: Contact through GitHub profiles
- **Documentation**: Refer to the Wiki section (coming soon)

---

## 🙏 Acknowledgments

- United International University (UIU) for academic support
- Course instructors and mentors for guidance
- Open-source community for amazing tools and libraries
- All contributors and testers who helped improve the platform

---

<div align="center">

**Made with ❤️ by the WorkSure Team**

*Connecting trusted professionals with those who need them*

⭐ Star this repository if you find it helpful!

</div>
