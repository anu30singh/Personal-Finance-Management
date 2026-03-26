#  Flexiwallet — Personal Finance Management App

Flexiwallet is a full-stack personal finance management application that helps users track expenses, manage savings goals, and gain intelligent insights into their financial habits.

Built as a production-ready project with a focus on **clean architecture, security, and real-world fintech patterns**.

---

## Features

### Authentication
- Secure email/password login
- JWT-based authentication
- Protected routes

### Wallet & Transactions
- Single wallet per user
- Add income & expense transactions
- Atomic balance updates (no race conditions)
- Recent transactions overview

### Savings Goals
- Create multiple savings goals
- Allocate money from wallet to goals
- Progress tracking with percentages
- Prevents over-allocation

### Reports
- Income vs Expense summary
- Category-wise expense breakdown
- Download financial report as **PDF**

### AI Insights (Rule-Based)
- Summarizes spending behavior
- Highlights top expense categories
- Flags high expense vs income trends
- Explainable & deterministic (no hallucinations)

---

## Architecture Overview

<img src = "client/src/assets/diagram-export-26-1-2026-11_09_33-am.png"/>

**Frontend**
- React
- Tailwind CSS
- React Router

**Backend**
- Node.js
- Express
- PostgreSQL
- JWT Authentication

**Key Engineering Decisions**
- Server-side validation
- SQL aggregation for reports
- Atomic DB transactions for money flow
- Rule-based AI for explainability

---
## Database Schema

<img src = "client/src/assets/diagram-export-26-1-2026-11_03_44-am.png"/>

## Screenshots
<img width="934" height="410" alt="{32558A24-51AA-4E21-8CAA-FD7ED700E92E}" src="https://github.com/user-attachments/assets/7c0fa626-46fb-4456-b5b2-a43cf979e782" />
<img width="947" height="409" alt="{F76DDAC4-78A7-44AA-9703-83149117ED13}" src="https://github.com/user-attachments/assets/dd1d9939-a0a7-4605-8a5a-392659e95ac1" />
<img width="839" height="418" alt="{C279AAC5-1B4E-4B39-811B-8ABBA769E6BA}" src="https://github.com/user-attachments/assets/3312b7ff-404a-4e55-8cee-65272a42bab1" />
<img width="677" height="410" alt="{07425C74-3C4E-4F15-B659-BB7E2BFABD98}" src="https://github.com/user-attachments/assets/123e99a9-d6a0-407f-bede-81f9890b6485" />
<img width="699" height="410" alt="{E9C0BEB8-AA47-4FAD-B61A-F84829571426}" src="https://github.com/user-attachments/assets/01cf0268-376d-4de2-b786-a29fa7731104" />
<img width="727" height="412" alt="{B0755F25-A17D-4F17-A740-53A2DD8E610E}" src="https://github.com/user-attachments/assets/303ad5a5-76aa-422c-899c-f11f18ba47ef" />







### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anu30singh/Personal-Finance-Management.git
cd Personal-Finance-Management
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Set REACT_APP_API_URL to your backend URL

# Start development server
npm start
```

4. **Access the application**
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```
