# Smart Parking System - Run Guide

This guide details the steps to set up and run the fully verified Smart Parking System (Backend, Frontend, and Admin Panel).

## 1. Prerequisites
- Node.js installed.
- MongoDB running (Locally or Atlas).
- Git (optional, for cloning).

## 2. Setup & Database Seeding
Before running the project, ensure dependencies are installed and the database is seeded with necessary data (Admin User, Parking Areas).

### Install Dependencies
Open a terminal in the project root (`Major_prjct`) and run:
```bash
# Backend
cd backend
npm install

# Admin
cd ../admin
npm install

# Frontend
cd ../frontend
npm install
```

### Seed the Database (CRITICAL)
You must run these scripts to create the Admin account and Parking Layouts.
```bash
cd backend

# 1. Create Parking Areas & Slots (Resets Booking Data)
node seed/seedParking.js

# 2. Create Admin User
node seed/seedAdmin.js
```
*Output should confirm: "✅ Admin user updated/created" and "✅ Parking areas & slots seeded successfully".*

## 3. Running the Project
You need to run **three separate terminals**, one for each component.

### Terminal 1: Backend Server
```bash
cd backend
npm start
```
*Runs on: `http://localhost:5000`*

### Terminal 2: Admin Panel
```bash
cd admin
npm start
```
*Runs on: `http://localhost:3000`*

### Terminal 3: Frontend (User App)
```bash
cd frontend
npm run dev
```
*Runs on: `http://localhost:5173`*

## 4. Usage Credentials

### Admin Login (Admin Panel)
- **URL**: `http://localhost:3000`
- **Reg No**: `ADMIN001`
- **Password**: `admin123`
- **Features**: Dashboard Stats, Parking Area View, **QR Scanner** (Verify Entry/Exit).

### Student Login (Frontend)
- **URL**: `http://localhost:5173`
- **Register**: Create a new account via the "Register" link.
- **Features**: Book Slot, View My Bookings (QR Code).

## 5. Testing the Flow
1.  **Book a Slot**: Log in to Frontend as Student -> Select Area -> Book 2W Slot.
2.  **Verify Entry**: Open Admin Panel -> QR Scanner -> Scan the Booking QR (simulated or real). System will mark as "Checked In".
3.  **Verify Exit**: Scan the same QR again. System will mark as "Completed" and free the slot.
