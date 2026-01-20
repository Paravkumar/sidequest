# 🚀 SideQuest: The Future of Student Earning

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://sidequest.engineer)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**SideQuest** is a decentralized campus marketplace built exclusively for students to turn their spare time into real cash. Whether it's delivering a lab report or grabbing a coffee for a peer, SideQuest facilitates a hyper-local economy within the campus walls.

[**Explore the App »**](https://sidequest.engineer)

---

# SideQuest
**A campus‑only marketplace where students post and complete micro‑tasks for cash or loot.**

[![Live](https://img.shields.io/badge/Live-sidequest.engineer-0b1020?style=for-the-badge&logo=vercel)](https://sidequest.engineer)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-13aa52?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

SideQuest is a hyper‑local, verified community where students can post “quests” (errands, assignments, tutoring) and earn instantly. The platform ensures safety with authentication, community locking, and real‑time chat.

**Live:** https://sidequest.engineer

---

## Highlights
- **Campus‑locked access** with verified email + OTP flow
- **Quest marketplace** for cash or loot rewards
- **Real‑time chat** via Pusher between quest creator and taker
- **Privacy‑first** contact sharing only after acceptance
- **Moderation‑ready** with profanity filtering

---

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend:** Next.js API Routes (Serverless)
- **Auth:** NextAuth (Credentials + Google)
- **Database:** MongoDB Atlas + Mongoose
- **Realtime:** Pusher
- **Email:** Nodemailer (OTP)
- **Mobile Shell:** Capacitor (Android project included)

---

## Product Flow
1. Sign up or log in
2. Verify email via OTP
3. Select campus/community
4. Post quests, accept quests, and chat in real time

---

## Project Structure
```
src/
   app/                 # Next.js App Router pages & API routes
   components/          # UI and feature components
   lib/                 # DB, mailer, utilities
   models/              # Mongoose models
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)

### Install
```bash
npm install
```

### Environment Variables
Create a `.env.local` file with the following:

```bash
# App & Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OTP
OTP_SECRET=your_otp_secret

# SMTP (OTP email)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=SideQuest <no-reply@sidequest.engineer>

# Pusher (Realtime chat)
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_app_secret
NEXT_PUBLIC_PUSHER_KEY=your_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_app_cluster
```

### Run locally
```bash
npm run dev
```

---

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — lint the codebase

---

## Deployment
Deploy on Vercel and set the same environment variables in the project settings. Ensure `NEXTAUTH_URL` matches your domain in production.

---

## Contributing
PRs and issues are welcome. Please open an issue for major changes.

---

## License
No license specified. All rights reserved.
