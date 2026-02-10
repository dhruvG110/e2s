

# Online Course Platform

## Overview
A professional, dark-mode-only online course platform built with React + Vite + Tailwind CSS, using Supabase for backend (database, auth, edge functions). Features MUX video playback, Razorpay payments, and a full admin panel.

## Design System
- **Dark mode only** with deep dark backgrounds
- **Purple-pink gradient accents** for buttons, borders, and highlights
- Glowing hover effects on cards and buttons
- Rounded cards with subtle border glow
- Clean, modern typography
- Fully responsive: desktop, tablet, mobile

---

## Pages & Features

### 1. Homepage
- Hero section with gradient text, description, and CTA buttons ("Enroll Now" / "Browse Courses")
- Featured courses grid with glowing card hover effects showing course image, title, price, and discount badge
- Footer with navigation links and social media icons

### 2. Authentication (Supabase Auth)
- Sign Up page: Name, Username, Phone, Email, Password fields
- Sign In page: Email + Password
- Google OAuth login button
- Dark-themed forms with glowing input borders and gradient submit buttons
- User profiles table storing name, username, phone number

### 3. Course Catalog / Dashboard
- Grid of all available courses with search bar and category filters
- Each course card: thumbnail, title, description snippet, price with discount display
- Promo code input field that dynamically shows updated price
- "Buy Now" button triggering Razorpay checkout flow
- Section showing user's purchased courses

### 4. Course Player
- MUX video player for lesson playback
- Collapsible sidebar listing all lessons in the course
- Active lesson highlighted, "Next Lesson" button
- Progress tracking: mark lessons complete, show overall course completion percentage
- Smooth transitions between lessons

### 5. Admin Panel (role-protected)
- **Course Management**: Create, edit, delete courses (title, description, price, discount, thumbnail)
- **Lesson Management**: Add/edit/reorder lessons per course (title, MUX video ID)
- **Promo Code Management**: Create promo codes linked to salespersons, set discount %, view usage count
- **Sales Dashboard**: View purchases, revenue, promo code usage stats

---

## Backend (Supabase)

### Database Tables
- **profiles** — user details (name, username, phone)
- **user_roles** — admin role management
- **courses** — title, description, price, discount, thumbnail_url, published status
- **lessons** — title, mux_video_id, course_id, order, duration
- **purchases** — user_id, course_id, amount_paid, payment_id
- **razorpay_payments** — order_id, payment_id, signature, status
- **course_progress** — user_id, lesson_id, completed flag
- **promo_codes** — code, discount_percent, salesperson_name, usage_count

### Edge Functions
- **create-razorpay-order** — creates Razorpay order for checkout
- **verify-razorpay-payment** — verifies payment signature and records purchase
- **apply-promo-code** — validates promo code and increments usage
- **admin-operations** — protected CRUD for courses/lessons/promos (admin role check)

### Auth
- Supabase Auth with email/password and Google OAuth
- RLS policies on all tables
- Admin role stored in user_roles table with security definer helper function

---

## Key Integrations
- **Razorpay**: Payment checkout via edge function (keys stored as Supabase secrets)
- **MUX**: Video playback using MUX Player React component (playback IDs stored per lesson)
- **Google OAuth**: Configured through Supabase Auth providers

