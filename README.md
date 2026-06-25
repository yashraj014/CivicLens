# CivicLens — Full-Stack Civic Infrastructure Management Platform

A modern civic-tech platform that empowers citizens to report public infrastructure issues and enables authorities to efficiently monitor, prioritize, and resolve them through an interactive geospatial dashboard.

---

## 🌐 Live Demo

### Frontend

**https://civiclens-profile.vercel.app/**

### Backend API

**https://civiclensapi.onrender.com/**

---

## 📖 Overview

CivicLens bridges the gap between citizens and local authorities by providing a centralized platform for reporting and managing civic infrastructure issues such as:

* Road damage and potholes
* Water supply issues
* Electrical faults
* Sanitation concerns

Citizens can submit geo-tagged reports with photographic evidence, while authorities can track issue progress, update statuses, analyze city-wide trends, and prioritize issues based on community engagement.

---

## ✨ Key Features

### 👥 Citizen Portal

* Secure account registration and login
* GPS-enabled issue reporting
* Photo evidence upload
* Community issue feed
* Interactive issue map
* Upvote system for issue prioritization
* Real-time status tracking

### 🏛️ Authority Portal

* Role-based authority dashboard
* Issue triage and management workflow
* Status updates (Reported → In Progress → Resolved)
* Access to uploaded evidence
* City-wide monitoring interface
* Resolution tracking

### 📊 Analytics Dashboard

* Total reported issues
* Category-wise distribution
* Resolution metrics
* Status breakdown visualization
* Interactive charts and KPIs

---

## 🏗️ System Architecture

```text
┌────────────────────┐
│   React Frontend   │
│     (Vercel)       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   FastAPI Backend  │
│     (Render)       │
└─────────┬──────────┘
          │
 ┌────────┴─────────┐
 ▼                  ▼

PostgreSQL      Supabase Storage
(Database)      (Image Evidence)
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* React Leaflet
* Recharts

### Backend

* FastAPI
* SQLAlchemy ORM
* Pydantic
* Python-Jose (JWT)
* Pwdlib

### Database

* PostgreSQL

### Cloud Services

* Supabase Object Storage

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 🔐 Authentication & Authorization

CivicLens uses a stateless JWT authentication system.

### Features

* Password hashing using pwdlib
* JWT access tokens
* Protected API routes
* Role-Based Access Control (RBAC)
* Authority-specific privileges

Example JWT Payload:

```json
{
  "sub": "1",
  "is_authority": true,
  "exp": 1719253000
}
```

Authorization decisions are performed directly from token claims, reducing unnecessary database lookups.

---

## 🗺️ Geospatial Reporting System

Citizens can report issues directly from their current location.

### Workflow

1. Browser requests GPS coordinates.
2. User uploads optional photo evidence.
3. Location and issue data are submitted.
4. Issue appears on the community map.
5. Authorities can immediately view and manage it.

### Technologies

* Browser Geolocation API
* React Leaflet
* OpenStreetMap

---

## ☁️ Image Upload Pipeline

CivicLens follows a two-step media upload architecture.

### Step 1

Upload image to Supabase Storage.

```text
Client
  │
  ▼
Supabase Storage
  │
  ▼
Public Image URL
```

### Step 2

Store generated URL inside issue record.

```text
Issue
 ├── title
 ├── description
 ├── location
 └── image_url
```

### Benefits

* Prevents orphaned records
* Improves reliability
* Separates storage from business logic
* Simplifies issue creation workflow

---

## 🗄️ Database Design

### User

| Field           | Type    |
| --------------- | ------- |
| id              | Integer |
| full_name       | String  |
| email           | String  |
| hashed_password | String  |
| is_authority    | Boolean |

---

### Issue

| Field        | Type        |
| ------------ | ----------- |
| id           | Integer     |
| title        | String      |
| description  | Text        |
| category     | Enum        |
| status       | Enum        |
| latitude     | Float       |
| longitude    | Float       |
| landmark     | String      |
| image_url    | String      |
| upvote_count | Integer     |
| reporter_id  | Foreign Key |

---

### Upvote

Composite Primary Key:

```sql
(user_id, issue_id)
```

This ensures:

* One vote per user per issue
* Database-level uniqueness
* Idempotent upvote operations

---

## 📈 Analytics Engine

The analytics service aggregates issue data in real time.

### Status Metrics

* Reported
* In Progress
* Resolved

### Category Metrics

* Road
* Water
* Electricity
* Sanitation

### Visualizations

* KPI Cards
* Bar Charts
* Donut Charts

Built using Recharts.

---

## 🔄 Issue Lifecycle

```text
Reported
    │
    ▼
In Progress
    │
    ▼
Resolved
```

Authorities can transition issues through each stage directly from the dashboard.

---

## 🚦 API Endpoints

### User APIs

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /users/register |
| POST   | /users/login    |
| GET    | /users/me       |

### Issue APIs

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /issues/create       |
| POST   | /issues/upload-image |
| GET    | /issues/fetch        |
| GET    | /issues/{id}         |
| PATCH  | /issues/{id}/status  |
| POST   | /issues/{id}/upvote  |

### Analytics APIs

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /analytics/summary |

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing
* Protected Endpoints
* Role-Based Access Control
* Composite Database Constraints
* Cascading Foreign-Key Relationships
* Server-Side Authorization Checks

---

## 📚 What I Learned

Through CivicLens, I gained practical experience with:

* Full-Stack Application Development
* REST API Design
* FastAPI Dependency Injection
* JWT Authentication & RBAC
* SQLAlchemy ORM
* PostgreSQL Relational Modeling
* Cloud Storage Integration
* Geospatial Web Applications
* React State Management
* Deployment & Production Hosting

---

## 🚀 Future Enhancements

* Real-time notifications using WebSockets
* Email alerts for issue updates
* AI-powered issue categorization
* Heatmap visualization for hotspots
* Mobile application support
* Docker containerization
* CI/CD using GitHub Actions
* Automated testing suite

---

## 👨‍💻 Team

CivicLens was developed collaboratively by:

- Kumar Yash Raj
- Aniket Kumar

We jointly worked across the entire development lifecycle, including system design, backend development, frontend implementation, database modeling, authentication, cloud storage integration, deployment, testing, and feature development.

The project was built as a full-stack civic-tech solution to improve the reporting, tracking, and resolution of public infrastructure issues through geospatial visualization, role-based workflows, and community-driven prioritization.
