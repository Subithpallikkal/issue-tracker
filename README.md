# 🚀 Issue Tracker with Gemini AI

A minimal full-stack issue tracking system with **AI-powered analysis** using Gemini.

This project demonstrates clean architecture, API design, and full-stack integration using modern technologies.

---

## 🚀 Live Deployments

- **Frontend (Application):** [Live Site](https://issue-tracker-ten-sable.vercel.app/)
- **Backend (API Base URL):** [Render API](https://issue-tracker-yie2.onrender.com)
- **API Documentation:** [Swagger Docs](https://issue-tracker-yie2.onrender.com/api/docs)
  

## 🧰 Tech Stack

### 🔙 Backend

* NestJS (TypeScript)
* PostgreSQL
* Drizzle ORM
* Swagger (API Docs)

### 🎨 Frontend

* Next.js (App Router)
* React + TypeScript
* Tailwind CSS

### 🤖 AI Integration

* Google Gemini (`gemini-2.5-flash`)

---

## 📁 Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── issues.controller.ts
│   │   │   └── discussions.controller.ts
│   │   ├── services/
│   │   │   ├── issues.service.ts
│   │   │   ├── discussions.service.ts
│   │   │   └── ai.service.ts
│   │   ├── dto/
│   │   │   ├── issue.dto.ts
│   │   │   └── discussion.dto.ts
│   │   ├── database/
│   │   │   ├── drizzle.module.ts
│   │   │   ├── drizzle.service.ts
│   │   │   ├── seed.ts
│   │   │   └── schema/
│   │   │       ├── issues.schema.ts
│   │   │       ├── discussions.schema.ts
│   │   │       ├── enums.schema.ts
│   │   │       └── index.ts
│   │   ├── enums/
│   │   │   └── issue.enum.ts
│   │   ├── exceptions/
│   │   │   ├── all-exceptions.filter.ts
│   │   │   └── custom.exceptions.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── issues/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── IssueForm.tsx
│   │   │   ├── IssueCard.tsx
│   │   │   ├── DiscussionList.tsx
│   │   │   ├── AddDiscussion.tsx
│   │   │   ├── AIAnalysis.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useIssues.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── issue.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── declarations.d.ts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Subithpallikkal/issue-tracker.git
cd issue-tracker
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file

```env
# Database (Use Neon or local PostgreSQL)
DATABASE_URL=postgres://user:password@localhost:5432/issue_tracker

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

PORT=3001
NODE_ENV=development
```

---

### 🗄 Database Setup

Make sure PostgreSQL is running.

Run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

### ▶️ Run Backend

```bash
npm run start:dev
```

Backend runs on:

```
http://localhost:3001
```

Swagger Docs:

```
http://localhost:3001/api
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔐 Environment Variables (Frontend)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---


## Seed Data (Sample Data) Instructions

You can populate the database with sample issues and discussions for quick testing.

### 1) Run seed script

From project root:

```bash
cd backend
npm install
npm run seed



## ✨ Features

* Create, update, and delete issues
* View all issues with:

  * Search
  * Filter
  * Sort
  * Pagination
* View issue details
* Add discussions/comments
* AI-powered issue analysis using Gemini

---

## 🤖 AI Analysis

Users can trigger AI analysis for any issue.

The system analyzes:

* Issue title
* Description
* Discussion history

### Output:

* Summary
* Root cause
* Suggested solutions

---

## 📡 API Overview

### Issues

* `GET /issues/get_all?page=<number>&limit=<number>`
* `POST /issues`
* `GET /issues/get_by_id/:uid`
* `PATCH /issues/issues/update`
* `DELETE /issues/delete`

### Discussions

* `GET /discussions/get_all_by_issue/:issueUid?page=<number>&limit=<number>`
* `POST /discussions/discussions`
* `PATCH /discussions/update`
* `DELETE /discussions/delete`

### AI

* `POST /issues/:id/analyze`

---

## 🌐 Database Note

You can use:

* Local PostgreSQL
  or
* Cloud database like Neon (recommended for sharing)

---

## ⚠️ Important Notes

* Do NOT commit `.env` files
* Use `.env.example` for reference
* Add your own Gemini API key

---

## 👨‍💻 Author

**Subith**
Full Stack Developer (MERN + Next.js + NestJS)

---

## 📌 Summary

This project was built to demonstrate:

* Backend architecture with NestJS
* Database design using Drizzle ORM
* Frontend integration with Next.js
* AI feature integration using Gemini

---
