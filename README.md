# 💰 Flexiwallet — Personal Finance Management App

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


## 🧪 Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Backend
```bash
cd backend
npm install
npm run dev
