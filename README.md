# 🏥 MediCure — Full-Stack Healthcare Platform

> A modern, production-ready telemedicine platform connecting patients with verified doctors through HD video consultations, real-time messaging, AI-powered health guidance, and a smart credit-based booking system.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io)](https://socket.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.dev/)
[![Deployed on Vercel + Render](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-00C7B7)](https://render.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Monorepo Structure](#-monorepo-structure)
- [System Architecture](#-system-architecture)
- [my-app — Next.js Frontend & Backend](#-my-app--nextjs-frontend--backend)
- [chat-server — Real-Time Messaging Server](#-chat-server--real-time-messaging-server)
- [signaling-server — WebRTC Signaling Server](#-signaling-server--webrtc-signaling-server)
- [Data Flow Diagrams](#-data-flow-diagrams)
- [Database Schema](#-database-schema)
- [Credit & Billing System](#-credit--billing-system)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [Deployment Guide](#-deployment-guide)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)

---

## 🔭 Overview

MediCure is a **three-service monorepo** that powers a complete healthcare ecosystem:

| Service | Technology | Hosted On | Purpose |
|---|---|---|---|
| `my-app` | Next.js 15 + TypeScript | Vercel | Main web application (frontend + API) |
| `chat-server` | Node.js + Socket.IO | Render | Real-time patient ↔ doctor messaging |
| `signaling-server` | Node.js + Socket.IO | Render | WebRTC signaling for video calls |

**Core capabilities:**
- 🔐 Role-based authentication (Patient / Doctor / Admin) via Clerk
- 📅 Smart appointment booking with 30-minute slot generation
- 💬 Real-time bidirectional chat between patients and doctors
- 📹 Peer-to-peer HD video calls via WebRTC (no media server needed)
- 🤖 RAG-powered AI health assistant (Groq LLM + HuggingFace embeddings)
- 💳 Subscription-based credit system with Clerk Billing
- 🏦 Doctor payout management via PayPal
- 🛡️ Admin panel for doctor verification and platform oversight

---

## 📁 Monorepo Structure

```
MediCare-testing/
├── my-app/                      # Next.js 15 application
│   ├── app/
│   │   ├── (auth)/              # Clerk sign-in / sign-up pages
│   │   ├── (main)/              # Protected app routes
│   │   │   ├── admin/           # Admin dashboard
│   │   │   ├── appointments/    # Patient & doctor appointments
│   │   │   ├── contact/         # Contact form
│   │   │   ├── doctor/          # Doctor dashboard (profile, earnings, availability)
│   │   │   ├── doctors/         # Patient-facing doctor browsing & booking
│   │   │   ├── onboarding/      # Role selection (Patient / Doctor)
│   │   │   └── pricing/         # Clerk PricingTable + plan info
│   │   ├── globals.css
│   │   ├── layout.tsx           # Root layout with Clerk + Toaster
│   │   └── page.tsx             # Landing page + credit allocation trigger
│   ├── actions/                 # Next.js Server Actions
│   │   ├── admin.ts             # Doctor verification, admin stats
│   │   ├── appointments.ts      # Booking, cancellation, completion
│   │   ├── chatbot.ts           # AI assistant (RAG pipeline)
│   │   ├── contact.ts           # Contact form mailer (Nodemailer)
│   │   ├── credits.ts           # Subscription plan detection + credit allocation
│   │   ├── doctor.ts            # Profile update, availability slots
│   │   ├── doctors-listing.ts   # Verified doctor listing
│   │   ├── message.ts           # Chat rooms + message persistence
│   │   ├── onboarding.ts        # Role assignment
│   │   ├── patient.ts           # Patient data queries
│   │   ├── payouts.ts           # Doctor earnings + payout requests
│   │   └── video-session.ts     # Video session token generation
│   ├── components/              # Shared UI components
│   │   ├── appointment-card.tsx
│   │   ├── chatbot-modal.tsx     # AI health assistant modal
│   │   ├── header.tsx            # Global navigation header
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── video-call-modal.tsx  # WebRTC video call UI
│   ├── lib/
│   │   ├── checkUser.ts          # Clerk → database user sync
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── specialities.ts       # Medical specialty list
│   ├── prisma/
│   │   └── schema.prisma         # Database schema (PostgreSQL / Neon)
│   └── middleware.ts             # Clerk auth middleware (route protection)
│
├── chat-server/                 # Real-time chat server
│   ├── chat-server.js
│   ├── package.json
│   └── .env
│
├── signaling-server/            # WebRTC signaling server
│   ├── signaling-server.js
│   ├── package.json
│   └── .env
│
└── render.yaml                  # Render.com deployment config (all 3 services)
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌───────────────────┐  │
│   │  Next.js UI  │   │  Socket.IO   │   │   WebRTC Peer     │  │
│   │  (React 19)  │   │  Chat Client │   │   Connection      │  │
│   └──────┬───────┘   └──────┬───────┘   └────────┬──────────┘  │
└──────────┼──────────────────┼────────────────────┼─────────────┘
           │ HTTPS            │ WSS                │ P2P (STUN/ICE)
           ▼                  ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Vercel Edge    │  │  Render.com      │  │  Render.com      │
│                  │  │                  │  │                  │
│  ┌────────────┐  │  │  ┌────────────┐  │  │  ┌────────────┐  │
│  │  my-app    │  │  │  │chat-server │  │  │  │ signaling  │  │
│  │  Next.js   │  │  │  │ Socket.IO  │  │  │  │  server    │  │
│  │  Server    │  │  │  │  Port 3002 │  │  │  │  Socket.IO │  │
│  │  Actions   │  │  │  └────────────┘  │  │  │  Port 3001 │  │
│  └─────┬──────┘  │  └──────────────────┘  │  └────────────┘  │
└────────┼─────────┘                        └──────────────────┘
         │ Prisma ORM                          (offer/answer/ICE relay)
         ▼
┌──────────────────────────────────────┐
│          Neon PostgreSQL             │
│   (Serverless Postgres Database)     │
│                                      │
│  Users · Appointments · ChatRooms    │
│  Messages · Availability · Payouts   │
│  CreditTransactions                  │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│          External Services           │
│                                      │
│  • Clerk    — Auth + Billing         │
│  • Groq     — LLM (AI chatbot)       │
│  • HuggingFace — Text Embeddings     │
│  • Nodemailer/Gmail — Contact email  │
│  • Google STUN — ICE candidate relay │
└──────────────────────────────────────┘
```

---

## 🖥️ my-app — Next.js Frontend & Backend

The main application is a **Next.js 15 App Router** project with both the UI and all backend logic co-located as **Server Actions**.

### Architecture

```
Request → Clerk Middleware → Next.js Route → Server Action → Prisma → Neon DB
                              ↑
                         React Server Components (SSR)
                         React Client Components (CSR for real-time UI)
```

### Route Map

| Route | Role | Description |
|---|---|---|
| `/` | Public | Landing page, AI chatbot FAB, Clerk PricingTable |
| `/sign-in`, `/sign-up` | Public | Clerk-hosted auth pages |
| `/onboarding` | Authenticated | Role selection (Patient or Doctor) |
| `/doctors` | Authenticated | Browse verified doctors by specialty |
| `/doctors/[specialty]/[id]` | Patient | Doctor profile + appointment booking |
| `/appointments` | Authenticated | View and manage all appointments |
| `/doctor` | Doctor | Dashboard (profile, availability, earnings, messages) |
| `/admin` | Admin | Doctor verification, platform stats |
| `/pricing` | Authenticated | Subscription plan selection (Clerk Billing) |
| `/contact` | Public | Contact form (sends email via Nodemailer) |

### Key Server Actions

#### `appointments.ts`
- **`getAvailableTimeSlots(doctorId)`** — Reads doctor's availability window, generates 30-minute slots for next 4 days, filters out already-booked slots and past times.
- **`createAppointment(data)`** — Validates credits (≥ 2), checks overlapping slots, creates appointment, deducts 2 credits from patient, adds 2 credits to doctor. All in one DB transaction.
- **`cancelAppointment(appointmentId)`** — Patient cancellation refunds 2 credits; doctor cancellation deducts 2 credits (penalty).
- **`completeAppointment(appointmentId)`** — Doctor-only action, only callable after appointment end time.

#### `credits.ts`
- **`getCurrentSubscriptionPlan()`** — Reads Clerk billing plan (`free_user` → 2 credits, `standard` → 20, `premium` → 100).
- **`checkAndAllocateCredits(dbUser)`** — Checks the `CreditTransaction` table to see if credits for the current plan were already given. If not, adds them atomically. **Database is the source of truth — not localStorage.**

#### `chatbot.ts`
- RAG pipeline: user message → HuggingFace text embeddings → context retrieval → Groq LLM completion → streaming response.

#### `message.ts`
- Manages `ChatRoom` creation (one per doctor-patient pair), fetches chat history, persists messages to DB.

#### `doctor.ts`
- Updates doctor profile (specialty, experience, description, credential URL).
- `setAvailabilitySlots` — Sets a single daily availability window (start/end time).

### Middleware

`middleware.ts` uses Clerk's `clerkMiddleware` to protect all `/appointments`, `/doctor`, `/admin`, `/onboarding` routes. Unauthenticated users are redirected to `/sign-in`.

---

## 💬 chat-server — Real-Time Messaging Server

A lightweight **Node.js + Express + Socket.IO** server dedicated to patient ↔ doctor real-time text messaging.

### Architecture

```
Patient Browser ──── WebSocket ────► chat-server ──── WebSocket ────► Doctor Browser
                                        │
                                   Socket.IO Room
                                  (keyed by chatRoomId)
                                        │
                               Message is relayed to all
                               other members of the room
                               (DB persistence happens via
                               my-app Server Action separately)
```

### Socket.IO Events

| Event | Direction | Payload | Action |
|---|---|---|---|
| `joinRoom` | Client → Server | `{ chatRoomId }` | Socket joins the named room |
| `leaveRoom` | Client → Server | `{ chatRoomId }` | Socket leaves the named room |
| `sendMessage` | Client → Server | `{ chatRoomId, message }` | Relays `message` to all others in room |
| `receiveMessage` | Server → Client | `message` object | Received by the other participant |
| `disconnect` | Client → Server | — | Socket cleanup |

### Design Decisions

- **Stateless relay**: The server does not store any messages. All message persistence is handled by the `sendMessage` Server Action in `my-app` which writes to the PostgreSQL database. This keeps the chat server simple and horizontally scalable.
- **Room isolation**: Each doctor-patient pair has a unique `chatRoomId` (UUID from the database). Rooms are managed entirely by Socket.IO's built-in room mechanism.
- **CORS**: Only accepts connections from `NEXT_PUBLIC_APP_URL` to prevent unauthorized access.

### Running Locally

```bash
cd chat-server
npm install
# Create .env with NEXT_PUBLIC_APP_URL=http://localhost:3000
node chat-server.js       # production
# or
npx nodemon chat-server.js  # development (auto-reload)
```

Default port: **3002**

---

## 📹 signaling-server — WebRTC Signaling Server

A **Node.js + Socket.IO** server that acts as the handshake broker for peer-to-peer WebRTC video calls. It **never touches audio/video media** — it only relays the negotiation messages.

### Why a Signaling Server?

WebRTC establishes direct peer connections, but before that happens, both peers must exchange:
1. **SDP Offer/Answer** — describes media capabilities (codecs, formats)
2. **ICE Candidates** — network path candidates for NAT traversal

These cannot be exchanged directly (peers don't know each other's addresses yet), so they go through this relay server.

### Architecture

```
Doctor Browser                              Patient Browser
      │                                           │
      │── join-room(appointmentId) ──────────────►│
      │                                           │
      │── offer(SDP) ──────────────────────────► │
      │                    signaling-server       │
      │                   (Socket.IO room         │
      │                    = appointmentId)       │
      │◄───────────────────── answer(SDP) ────── │
      │                                           │
      │── ice-candidate ────────────────────────► │
      │◄────────────────────── ice-candidate ──── │
      │                                           │
      └──── Direct P2P WebRTC Connection ─────────┘
                  (audio + video stream)
```

### Socket.IO Events

| Event | Direction | Payload | Action |
|---|---|---|---|
| `join-room` | Client → Server | `appointmentId` (string) | Socket joins room; stores in `activeConnections` Map |
| `offer` | Client → Server | `{ appointmentId, offer }` | Relays SDP offer to others in the room |
| `answer` | Client → Server | `{ appointmentId, answer }` | Relays SDP answer back to the offerer |
| `ice-candidate` | Client → Server | `{ appointmentId, candidate }` | Relays ICE candidate to the other peer |
| `call-accepted` | Client → Server | `{ appointmentId }` | Notifies other peer that call was accepted |
| `call-rejected` | Client → Server | `{ appointmentId }` | Notifies other peer that call was rejected |
| `disconnect` | Automatic | — | Removes from `activeConnections` Map |

### Race Condition Handling

The Doctor side uses a **retry loop** (every 3 seconds) to re-emit the SDP offer until the connection reaches `"connected"` state. This ensures the call connects successfully even if the Patient joins the room several seconds after the Doctor.

### ICE / STUN

The frontend `video-call-modal.tsx` uses Google's public STUN server:
```
stun:stun.l.google.com:19302
```

This enables NAT traversal for most home network configurations without needing a TURN server.

### Running Locally

```bash
cd signaling-server
npm install
# Create .env with NEXT_PUBLIC_APP_URL=http://localhost:3000
node signaling-server.js       # production
# or
npx nodemon signaling-server.js  # development
```

Default port: **3001**

---

## 🔄 Data Flow Diagrams

### 1. Patient Books an Appointment

```
Patient clicks time slot
        │
        ▼
createAppointment() [Server Action]
        │
        ├── auth() → verify Clerk session
        ├── DB: find patient by clerkUserId
        ├── Check credits ≥ 2
        ├── DB: verify doctor exists + VERIFIED
        ├── DB: check no overlapping appointment
        └── DB.$transaction()
              ├── Create Appointment record
              ├── Deduct 2 credits from patient
              └── Add 2 credits to doctor
                      │
                      ▼
              revalidatePath("/appointments")
              → Patient redirected to /appointments
```

### 2. Real-Time Chat Flow

```
Patient types message → handleSendMessage()
        │
        ├── socket.emit("sendMessage", { chatRoomId, message })
        │         │
        │         ▼
        │    chat-server
        │    socket.to(chatRoomId).emit("receiveMessage", message)
        │         │
        │         ▼
        │    Doctor browser receives "receiveMessage"
        │    → React state update → UI shows message
        │
        └── sendMessage() [Server Action]
                  └── db.message.create() → Persists to PostgreSQL
```

### 3. Video Call Establishment (WebRTC)

```
Doctor clicks "Start Video Call"
        │
        ├── getUserMedia() → camera + mic
        ├── socket.emit("join-room", appointmentId) → signaling-server
        ├── RTCPeerConnection.createOffer()
        └── socket.emit("offer", { appointmentId, offer })
                  │
                  ▼  [relayed by signaling-server]
Patient clicks "Start Video Call"
        │
        ├── getUserMedia() → camera + mic
        ├── socket.emit("join-room", appointmentId) → signaling-server
        ├── receives "offer" event
        ├── peerConnection.setRemoteDescription(offer)
        ├── peerConnection.createAnswer()
        └── socket.emit("answer", { appointmentId, answer })
                  │
                  ▼  [relayed by signaling-server]
Doctor receives "answer"
        │
        ├── peerConnection.setRemoteDescription(answer)
        └── ICE candidates exchanged via "ice-candidate" events
                  │
                  ▼
        Direct P2P video/audio stream established
        (signaling-server no longer involved)
```

---

## 🗄️ Database Schema

**Provider**: PostgreSQL (hosted on Neon — serverless)  
**ORM**: Prisma 6

```
┌─────────────────────────────────────────────────────────────────┐
│                           User                                  │
│  id (UUID) · clerkUserId · email · name · role · credits        │
│  specialty · experience · credentialUrl · description           │
│  verificationStatus                                             │
└──┬────────────────────────────────────────┬────────────────────┘
   │                                        │
   │ 1:N (as patient)    1:N (as doctor)    │ 1:N
   ▼                     ▼                  ▼
┌──────────────┐  ┌─────────────────┐  ┌──────────────────────┐
│ Appointment  │  │  Availability   │  │  CreditTransaction   │
│ patientId    │  │  doctorId       │  │  userId              │
│ doctorId     │  │  startTime      │  │  amount              │
│ startTime    │  │  endTime        │  │  type (ENUM)         │
│ endTime      │  │  status (ENUM)  │  │  packageId           │
│ status (ENUM)│  └─────────────────┘  └──────────────────────┘
│ videoSession │
└──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          ChatRoom                               │
│  id · doctorId · patientId                                      │
│  @@unique([doctorId, patientId])                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ 1:N
                           ▼
                    ┌────────────┐
                    │  Message   │
                    │ chatRoomId │
                    │ senderId   │
                    │ content    │
                    │ messageType│
                    └────────────┘

┌─────────────────┐    ┌──────────────┐
│   ChatMessage   │    │    Payout    │
│  (AI chatbot)   │    │  (Doctor)    │
│  userId · role  │    │  doctorId    │
│  content        │    │  credits     │
└─────────────────┘    │  netAmount   │
                       │  paypalEmail │
                       └──────────────┘
```

**Enums:**
- `UserRole`: `UNASSIGNED | PATIENT | DOCTOR | ADMIN`
- `VerificationStatus`: `PENDING | VERIFIED | REJECTED`
- `AppointmentStatus`: `SCHEDULED | COMPLETED | CANCELLED`
- `SlotStatus`: `AVAILABLE | BOOKED | BLOCKED`
- `TransactionType`: `CREDIT_PURCHASE | APPOINTMENT_DEDUCTION | ADMIN_ADJUSTMENT`
- `PayoutStatus`: `PROCESSING | PROCESSED`

---

## 💳 Credit & Billing System

### Credit Flow

```
Patient subscribes via Clerk Billing (PricingTable)
        │
        ▼
Landing page load triggers checkAndAllocateCredits()
        │
        ├── getCurrentSubscriptionPlan() reads Clerk auth().has({ plan })
        │
        ├── Check DB: CreditTransaction with type=CREDIT_PURCHASE + packageId=plan
        │       exists? → skip (already allocated)
        │       missing? → allocate credits in DB transaction
        │
        └── User.credits incremented

Plan Credits:
  free_user → 2 credits (new account default)
  standard  → 20 credits
  premium   → 100 credits

Appointment Cost: 2 credits per booking
  Patient pays 2 credits → Doctor receives 2 credits

Cancellation Policy:
  Patient cancels → refunded 2 credits
  Doctor cancels  → penalised 2 credits

Doctor Payouts:
  Rate: 1 credit = $8 net (platform keeps $2/credit)
  Paid via PayPal (doctor submits PayPal email)
  Admin reviews and marks payout as PROCESSED
```

---

## 🔑 Environment Variables

### `my-app/.env`

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# AI Services
GROQ_API_KEY=gsk_...
HUGGINGFACE_API_KEY=hf_...

# Email (Contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# Backend service URLs
NEXT_PUBLIC_SIGNALING_SERVER_URL=https://your-signaling.onrender.com
NEXT_PUBLIC_CHAT_SERVER_URL=https://your-chat.onrender.com
```

### `chat-server/.env`

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
PORT=3002
```

### `signaling-server/.env`

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
PORT=3001
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL database (or Neon free tier)
- Clerk account (free tier works)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd MediCare-testing
```

### 2. Set up the database

```bash
cd my-app
cp .env.example .env     # fill in your values
npx prisma generate       # generate Prisma client
npx prisma db push        # push schema to your database
```

### 3. Start all three services (3 terminals)

**Terminal 1 — Next.js app**
```bash
cd my-app
npm install
npm run dev
# → http://localhost:3000
```

**Terminal 2 — Chat server**
```bash
cd chat-server
npm install
# .env: NEXT_PUBLIC_APP_URL=http://localhost:3000
node chat-server.js
# → http://localhost:3002
```

**Terminal 3 — Signaling server**
```bash
cd signaling-server
npm install
# .env: NEXT_PUBLIC_APP_URL=http://localhost:3000
node signaling-server.js
# → http://localhost:3001
```

### 4. Verify services are running

- `http://localhost:3000` → MediCure web app
- `http://localhost:3001` → `Signaling Server is running 🚀`
- `http://localhost:3002` → `Chat Server is running 🚀`

---

## 🌐 Deployment Guide

All three services are configured in `render.yaml` for one-click deployment on Render.

### Vercel (my-app)

1. Import the repository into Vercel
2. Set root directory to `my-app`
3. Add all environment variables from `my-app/.env`
4. Deploy

### Render (chat-server + signaling-server)

1. Connect your repository to Render
2. Use the `render.yaml` at the root — it auto-configures both Node services
3. Set secret environment variables (DATABASE_URL, Clerk keys, etc.) in the Render dashboard
4. The `NEXT_PUBLIC_APP_URL` on both servers must point to your Vercel deployment URL

### Post-deployment Checklist

- [ ] Update `NEXT_PUBLIC_SIGNALING_SERVER_URL` in Vercel env vars to your Render signaling URL
- [ ] Update `NEXT_PUBLIC_CHAT_SERVER_URL` in Vercel env vars to your Render chat URL
- [ ] Set Admin role: find your user in the DB and set `role = 'ADMIN'`
- [ ] Configure Clerk Billing plans (`free_user`, `standard`, `premium`) in Clerk Dashboard

---

## ✨ Key Features

### For Patients
- Browse doctors by medical specialty
- View doctor profiles, experience, and verification status
- Book 30-minute appointment slots from next 4 days availability
- Real-time chat with your doctor
- HD video consultation (peer-to-peer, no quality loss)
- AI health assistant available 24/7
- Credit-based payment (auto-allocated on subscription)

### For Doctors
- Set daily availability window (applies to all days)
- View and manage all appointments
- Real-time patient messaging dashboard
- HD video call initiation
- Earnings dashboard (total, monthly, per-appointment)
- PayPal payout requests

### For Admins
- Verify or reject pending doctor registrations
- View platform-wide statistics
- Manage doctor credentials

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.3 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui + Radix UI | Latest | Accessible component library |
| Lucide React | 0.513 | Icon library |
| React Hook Form + Zod | Latest | Form validation |
| Sonner | 2 | Toast notifications |
| date-fns | 4 | Date utilities |

### Backend / Infrastructure
| Technology | Version | Purpose |
|---|---|---|
| Next.js Server Actions | 15.3 | API layer (co-located with UI) |
| Prisma | 6.10 | ORM + migrations |
| Neon PostgreSQL | — | Serverless database |
| Clerk | 6.21 | Authentication + Billing |
| Socket.IO | 4.8 | Real-time WebSockets |
| Groq | — | Fast LLM inference (chatbot) |
| HuggingFace | — | Text embeddings (RAG) |
| Nodemailer | 6 | Contact form emails |
| WebRTC (browser native) | — | P2P video calls |

### DevOps
| Tool | Purpose |
|---|---|
| Vercel | Next.js hosting (Edge Network) |
| Render | Node.js server hosting |
| render.yaml | Infrastructure as Code |

---

## 📝 License

This project was built by **Abhishek Singh** as a showcase of full-stack engineering skills including:

- **RAG-powered AI** — LangChain patterns, LLM APIs, healthcare context-aware retrieval
- **Real-time systems** — Socket.IO rooms, WebRTC peer connections, ICE/STUN negotiation
- **Production architecture** — Microservice separation, serverless DB, Clerk auth
- **Credit billing** — Subscription plan detection, atomic DB transactions, payout management

---

*Built with ❤️ for better healthcare.*
