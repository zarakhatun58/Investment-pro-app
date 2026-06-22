# InvestPro - Investment & Referral Platform

## Features

### User Features
- User registration with referral code support
- JWT-based authentication
- Multiple investment plans with daily ROI
- Real-time wallet balance tracking
- Multi-level referral system (10 levels)
- Complete transaction history
- Interactive dashboard with charts

### Investment Plans
| Plan | Min Amount | Max Amount | Daily ROI | Duration |
|------|------------|------------|-----------|----------|
| Starter | $100 | $999.99 | 1.00% | 30 days |
| Growth | $1,000 | $4,999.99 | 1.50% | 60 days |
| Premium | $5,000 | $19,999.99 | 2.00% | 90 days |
| Elite | $20,000 | $100,000 | 2.50% | 120 days |

### Level Income Distribution
| Level | Percentage |
|-------|------------|
| 1 | 10.00% |
| 2 | 5.00% |
| 3 | 3.00% |
| 4 | 2.00% |
| 5 | 1.50% |
| 6 | 1.00% |
| 7 | 0.75% |
| 8 | 0.50% |
| 9 | 0.25% |
| 10 | 0.10% |

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Date-fns** - Date utilities

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Swagger API Documentation
- Node Cron

## Project Structure

backend/
├── src/
│
├── config/
│   ├── db.js
│   └── swagger.js
│
├── models/
│   ├── User.js
│   ├── Plan.js
│   ├── Investment.js
│   ├── RoiHistory.js
│   └── ReferralIncome.js
│
├── controllers/
├── routes/
├── middleware/
├── services/
├── cron/
│
└── server.js
## Database Models
(Mongoose Schemas)

User
Plan
Investment
RoiHistory
ReferralIncome
WalletTransaction
## API Endpoints

### Authentication

POST /api/register
POST /api/login
GET /api/profile

Authentication is secured using JWT tokens.
Passwords are hashed using bcryptjs.

### Investments
- `GET /investments` - Fetch user investments
- `POST /investments` - Create new investment

### Dashboard
- `GET /users/:id` - Fetch user profile with stats
- `GET /roi_history` - Fetch ROI transactions
- `GET /referral_income` - Fetch level income

### Referrals
- `GET /users?referred_by=eq.id` - Direct referrals
- RPC `get_referral_tree` - Complete tree structure

## Cron Job

The `process-roi` Edge Function runs daily at 12:00 AM to:

1. **Process Daily ROI**
   - Fetches all active investments
   - Calculates daily ROI amount
   - Stores in roi_history (with unique constraint)
   - Updates user wallet balance
   
2. **Process Level Income**
   - Traverses referral hierarchy (10 levels)
   - Calculates income for each level
   - Stores in referral_income (with unique constraint)
   - Updates upline users' wallets

### Idempotency
- Unique constraints on (investment_id, date) for ROI
- Unique constraints on (receiver_user_id, investment_id, level, date) for referrals
- Prevents duplicate credits if cron runs multiple times

## Environment Variables

```env
PORT=5000

MONGO_URI=..........................

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173
```

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository>
cd investpro
npm install
```

### 2. Configure Environment
Create `.env` 
```env

```

## Daily ROI Processing

The system uses node-cron to automatically:

1. Process Daily ROI
2. Update User Wallet
3. Generate ROI History
4. Distribute 10-Level Referral Income
5. Prevent Duplicate Processing

Schedule:

0 0 * * *

Runs every day at 12:00 AM.


### 4. Deploy Edge Function
```
deploy in render 
```

## Swagger API Docs

Swagger UI is available at:

http://localhost:5000/api/docs

Features:

- Interactive API testing
- JWT Authorization support
- Request/Response examples
- API schema documentation

### 6. Run Development Server
```bash
npm run dev
```

### 7. Build for Production
```bash
npm run build
npm run preview
```

## RLS Policies

All tables have Row Level Security enabled:

- **users**: Users can only read/update their own profile
- **investments**: Users can only access their own investments
- **roi_history**: Users can only see their own ROI records
- **referral_income**: Users can only see their received income
- **investment_plans**: Read-only for authenticated users
- **level_income_config**: Read-only for authenticated users

## Security

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes Middleware
- MongoDB Validation
- Helmet Security Headers
- Express Rate Limiting
- CORS Protection

## Assumptions

1. Daily ROI is calculated and distributed automatically at 12:00 AM
2. Referral income is based on daily ROI earned by referrals
3. Wallet balance can be used for reinvestment (future feature)
4. Minimum 6 characters for passwords
5. Email confirmation is disabled for faster testing
6. Network fees are not deducted from ROI

## Future Enhancements

- [ ] Withdrawal system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Investment from wallet balance
- [ ] Real-time notifications
- [ ] Mobile app (React Native)

## License

MIT
