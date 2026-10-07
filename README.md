# 🩺 MediPulse: Doctor & Patient Care Management Platform

A modern, full-stack medical practice web application built with **Next.js 14 (App Router)** on the frontend and **Node.js, Express, MongoDB & Mongoose** on the backend.

Designed for doctors and clinics to offer comprehensive, 360-degree medical services to their patients, including dynamic appointment booking, digital prescriptions (Rx) with PDF printing, health records tracking, patient reviews, and doctor management workspaces.

---

## 🌟 Key Features

### 👩‍⚕️ For the Doctor & Clinic
- **Lead Doctor Profile & Credentials**: Specializations, certifications, affiliations, consultation fees, and working hours.
- **Doctor Workspace Dashboard**:
  - Live metric counters: Total Patients, Today's Appointments, Pending Approval, Completed Consultations, Total Prescriptions, Revenue.
  - Appointment Management: Filter by status (`all`, `pending`, `confirmed`, `completed`, `cancelled`), approve or reschedule slots.
  - Digital Prescription (Rx) Issuer: Add clinical diagnoses, record patient vitals (BP, pulse, temp, weight), prescribe medications with structured frequency/dosage schedules, advice, and recommended laboratory tests.
  - Patient Inquiries & Messaging: Read patient queries and transmit direct clinical replies.
  - Catalog Management: Configurable medical services with pricing and durations.

### 🧑 For Patients
- **Interactive 3-Step Booking Wizard**:
  - Select service & format (**In-Person Clinic Visit** or **Telemedicine HD Video Call**).
  - Dynamic slot checker: automatically prevents double-booking and checks real-time slot availability.
  - Instant appointment confirmation & portal tracking.
- **Patient Health Portal (`/portal`)**:
  - Track upcoming & past appointments with status badges.
  - Digital Prescriptions (Rx) viewer with a printable/saveable medical certificate modal.
  - Medical Profile & History: Blood group, known allergies, chronic conditions, emergency contact.
  - Ask Doctor non-urgent inquiries and review past replies.
  - Submit verified feedback & testimonials with star ratings.

### ⚡ Out-of-the-Box Zero-Config Database
- Supports standard MongoDB (`mongodb://localhost:27017/doctor_portal` or MongoDB Atlas).
- **Embedded In-Memory Fallback**: If no local MongoDB service is currently running, the server automatically boots an in-memory MongoDB instance and auto-seeds the doctor account, 8 services, sample appointments, and prescriptions!

---

## 🔑 Demo Accounts (Ready to Test)

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **👩‍⚕️ Lead Doctor** | `doctor@drjenkinsclinic.com` | `Password123!` | `/doctor` (Doctor Workspace) |
| **🧑 Demo Patient** | `patient@example.com` | `Password123!` | `/portal` (Patient Portal) |

*(Quick 1-Click buttons for both accounts are available on the [Login Page](http://localhost:3000/login)!)*

---

## 🏗️ Architecture & Tech Stack

```
projectOne/
├── backend/                  # Node.js + Express REST API + Mongoose
│   ├── src/
│   │   ├── config/db.js      # MongoDB connection with in-memory fallback
│   │   ├── models/           # Mongoose Models (User, Service, Appointment, Prescription, Message, Review)
│   │   ├── controllers/      # Business logic & endpoints
│   │   ├── routes/           # REST API routes
│   │   ├── middleware/       # JWT Auth & centralized error handling
│   │   ├── seeds/seed.js     # Realistic medical database seeder
│   │   └── server.js         # Express app entrypoint
│   └── package.json
│
├── frontend/                 # Next.js 14 (App Router) + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── page.tsx      # Landing page / Hero / Services / Reviews
│   │   │   ├── services/     # Full searchable medical services catalog
│   │   │   ├── book-appointment/ # 3-step dynamic booking wizard
│   │   │   ├── portal/       # Patient Health Portal (Rx, Appointments, Profile)
│   │   │   ├── doctor/       # Doctor Workspace & Dashboard
│   │   │   ├── login/        # Sign In (with 1-Click Demo buttons)
│   │   │   ├── register/     # Patient Registration
│   │   │   ├── about/        # Doctor Biography & Credentials
│   │   │   └── contact/      # Clinic Location, Hotline & Inquiries
│   │   ├── components/       # Navbar, Footer, ServiceCard, PrescriptionModal, etc.
│   │   ├── context/          # AuthContext (JWT & session state)
│   │   └── lib/api.ts        # Axios API client with token interceptor
│   └── package.json
│
├── package.json              # Root package to run both concurrently
└── README.md
```

---

## ⚡ Deploying to Vercel (Live in Browser)

This project is fully configured for **1-click seamless deployment on Vercel**!

### Method 1: Deploy with Vercel Web Dashboard (GitHub)
1. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. **Settings**:
   - If deploying from the repository root: Vercel will automatically detect `vercel.json` and build the frontend!
   - *(Optional alternative)*: You can set **Root Directory** to `frontend`.
5. Click **Deploy**!
6. Once deployed, open your live `.vercel.app` URL directly in your browser. All features work immediately!

---

### Method 2: Deploy directly via Vercel CLI
If you have the Vercel CLI installed:
```bash
# In the projectOne root directory:
npx vercel
```
Follow the quick prompts and select default settings. Once deployed to production:
```bash
npx vercel --prod
```

---

### 🌐 Live Features on Vercel Out-of-the-Box:
- **Serverless API**: Next.js Serverless Route Handlers in `src/app/api` serve all medical practice endpoints directly from Vercel with zero latency and no external server required.
- **Pre-Seeded Clinical Data**: The platform comes loaded with Dr. Sarah Jenkins' profile, 8 medical services, patient reviews, sample appointments, and prescriptions.
- **Dynamic State**: You can book real-time appointments, log in with demo accounts, update doctor dashboard statuses, issue prescriptions, and submit reviews right in your browser!
- **Optional Persistent Database**: If you want to connect a dedicated MongoDB Atlas database later, simply add the `MONGODB_URI` environment variable in your Vercel Project Settings (**Settings > Environment Variables**).

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create patient account
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/auth/me` - Get current session
- `PUT /api/auth/profile` - Update patient/doctor profile
- `GET /api/auth/doctor-profile` - Lead doctor public details

### Medical Services (`/api/services`)
- `GET /api/services` - List active services & treatments
- `GET /api/services/:idOrSlug` - Get service details
- `POST /api/services` - Doctor creates service

### Appointments (`/api/appointments`)
- `GET /api/appointments/available-slots?date=YYYY-MM-DD` - Check open slots
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my-appointments` - Current patient appointments
- `GET /api/appointments` - All appointments (Doctor view)
- `PUT /api/appointments/:id/status` - Update status (`confirmed`, `completed`, `cancelled`)
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Prescriptions (`/api/prescriptions`)
- `POST /api/prescriptions` - Doctor issues digital prescription
- `GET /api/prescriptions/my-prescriptions` - Patient's prescriptions
- `GET /api/prescriptions` - Doctor's issued prescriptions
- `GET /api/prescriptions/:id` - View single prescription

### Messages & Reviews (`/api/messages`, `/api/reviews`, `/api/stats`)
- `POST /api/messages` - Submit contact inquiry
- `GET /api/messages` - Doctor views inquiries
- `PUT /api/messages/:id/reply` - Doctor sends reply
- `GET /api/reviews` - Public patient reviews
- `POST /api/reviews` - Submit review
- `GET /api/stats/dashboard` - Doctor KPI metrics
