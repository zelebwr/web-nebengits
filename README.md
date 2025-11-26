# NebengIts Web Application

## Table of Content
- [A. Introduction](#a-introduction)
- [B. Benefits](#b-benefits)
  - [1. ITS College Students](#1-its-college-students)
  - [2. ITS Institute](#2-its-institute)
  - [3. Society](#3-society)
- [C. Idea's Nitty Gritty](#c-ideas-nitty-gritty)
- [D. User Roles \& Capabilities {#this-is-that}](#d-user-roles--capabilities-this-is-that)
  - [1. The Driver](#1-the-driver)
  - [2. The Passenger](#2-the-passenger)
- [E. Detailed Feature \& Component Breakdown](#e-detailed-feature--component-breakdown)
  - [1. Authentication \& Gatekeeping System](#1-authentication--gatekeeping-system)
  - [2. The "Ride Board" (Core CRUD Module)](#2-the-ride-board-core-crud-module)
  - [3. The "OTP Trust" Verification System](#3-the-otp-trust-verification-system)
  - [4. Media \& Identity Verification (File Handling)](#4-media--identity-verification-file-handling)
  - [5. The "Green Wallet" (Gamification Engine)](#5-the-green-wallet-gamification-engine)
  - [6. Communication Bridge (UX Feature)](#6-communication-bridge-ux-feature)
  - [Summary of Data Flow (How they connect)](#summary-of-data-flow-how-they-connect)
- [F. Directory Structure](#f-directory-structure)
  - [1. Root \& Configuration](#1-root--configuration)
  - [2. `packages/client` (Frontend)](#2-packagesclient-frontend)
  - [3. `packages/server` (Backend)](#3-packagesserver-backend)
  - [4. `packages/shared` (Common)](#4-packagesshared-common)
- [G. Tech Stack](#g-tech-stack)
  - [1. Monorepo \& Language](#1-monorepo--language)
  - [2. Frontend (Client)](#2-frontend-client)
  - [3. Backend (Server)](#3-backend-server)
  - [4. Database](#4-database)
- [H. Database Schema](#h-database-schema)
  - [1. User Model (`User`)](#1-user-model-user)
  - [2. Ride Model (`Ride`)](#2-ride-model-ride)
  - [3. Entity Relationship Diagram (ERD) Conceptualization](#3-entity-relationship-diagram-erd-conceptualization)
  - [4. Prisma Schema Definition](#4-prisma-schema-definition)
- [I. API Endpoints](#i-api-endpoints)
  - [1. Authentication (`/api/auth`)](#1-authentication-apiauth)
  - [2. User Management (`/api/users`)](#2-user-management-apiusers)
  - [3. Ride Operations (`/api/rides`)](#3-ride-operations-apirides)
  - [4. Image Serving (`/uploads`)](#4-image-serving-uploads)
- [J.  How to Run This Project (Fork \& Setup)](#j--how-to-run-this-project-fork--setup)
  - [Prerequisites](#prerequisites)
  - [1. Fork \& Clone](#1-fork--clone)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Database Setup \& Seeding](#4-database-setup--seeding)
  - [5. Run the App](#5-run-the-app)
- [K. How to Test the Flow](#k-how-to-test-the-flow)


## A. Introduction

As productive human beings with a lot of necessities in life, we have a lot of needs to go outside and get things done. This fact will be more valid if we are college students where we have needs to be done outside/outdoor other than the primary necessities, such as college responsibilities. With that being said, this brings us to the primary topic related to what I'm bringing up in this project, which is **Transportation**.

Transportation itself is a media of transport, where it has become one of the most needed tool in our daily life. The more needs we have outside, the higher the value of transportation goes up. But transportation itself isn't a free ride. It costs us heavily at the start and it will cost us more gradually from the fuel cost. That's why in this project of mine, I'll be talking about a solution, a cheaper alternative in everyday media of transportation to solve the **Costly Media of Transportation** issue.

Here, the solution to the Costly Media of Transportation lies on the web application I'm trying to make, **NebengIts**. NebengIts is a web application (for now) that provides an alternative method of transportation for **ITS College Students**. The cheaper method of transportation that is provided here are based on **cooperation** with the ITS Institute itself as a sponsor and between each ITS college students as to work together in providing "free" rides for the same ITS College Students. 

For more detailed explanation about NebengIts, it can be seen below.

---

## B. Benefits

For this application to work, of course there'd be a need in demand. Where demand is completed, it means there is benefit. Here are the benefits of this application from a few different perspectives.

### 1. ITS College Students

For ITS College Students, this web application will be a platform to provide an alternative for a cheaper media of transportation for daily uses. This will be a great selling point, especially because when it comes to daily daily repetitive trips (e.g., going to campus) the driver can gain profit without costing more then they already need to from daily expenses. This will benefit both dearly as such: 
- **Driver:** They will gain additional profit for going on to a trip to the same destination as themselves without losing anything more (e.g., fuel).
- **Rider:** They will gain "free" rides to the same destination as the driver is, so they can go to their own destination as well without the need of spending transportation fee.

### 2. ITS Institute

For ITS Institute, this web application's main idea will help them to achieve their goal on reaching Green Campus, where with less college students bringing their own media of transportation will cut down the gas emission by vehicles in campus immensely. Additionally, ITS will gain prestige when this idea can cut down gas emission by vehicles significantly around the campus area, saying that "ITS has made Surabaya greener". 

This will be a great service contribution for ITS to the society as well as it is a great implementation as for an SDG solution, as ITS Institute follows SDG as their main reference in solutions in reaching international grounds. This can also be a great idea for ITS to start a "movement" in the world of education, where ITS will be the "first" in Surabaya to start a green movement by cutting down vehicle emission in the world of college education. This idea will also especially affect ITS's surroundings for the reason that most residences around ITS is also inhabited by ITS College Students, bringing great benefit.

### 3. Society

For the Society, this web application will provide a solution to traffic jams (especially at Keputih) and vehicle gas emission in Surabaya. Since Surabaya is one of the most populated city in Indonesia and most residents and non-residents uses a motor vehicle in Surabaya, this will solution can be of help in reducing the traffic jam and motor vehicle gas emission in Surabaya.

---

## C. Idea's Nitty Gritty

The way this application can work IRL is by having ITS Institute willingly be the sponsor of this application. Why so? Here are the detailed rundown on how this application should work (workflow) when implemented.

- **Step 1 (Driver):** Posts a ride.
- **Step 2 (Passenger):** Clicks "Join Ride." The System gives the **Passenger** a unique 4-digit code (e.g., `8921`).
- **Step 3 (The Ride):** They meet and drive to the same destination.
- **Step 4 (Verification):** Upon arrival, the Passenger **tells the code** to the Driver.
- **Step 5 (Claiming Points):** The Driver inputs `8921` into their dashboard.
- **Step 6 (Success):** The System verifies the code.
    - Ride status becomes `Completed`.
    - Driver gets **+15 Green Points**.
    - Passenger gets **+5 Green Points** (for being eco-friendly).

So, this application work with a **point-based** system where the application users can exchange their points to gain rewards in the shop that are fully sponsored by the campus itself.

---

## D. User Roles & Capabilities {#this-is-that}

To ensure the ecosystem runs smoothly and safely, the application is divided into specific roles with distinct responsibilities.

### 1. The Driver

This role are for students who own a vehicle (Car/Motorbike) and want to earn Green Points (GP).
- **Create Ride (Post):** Can post a ride offer by specifying **destination**, **time**, and **pickup point**.
- **Safety Verification (Upload):** Must upload a **photo of their vehicle or helmet** when creating a ride to ensure users can recognize them.
- **Redeem Code:** Has a dashboard input field to enter the passenger's "Boarding Code" to prove the ride finished.
- **Rewards:** Earns higher points (+15) per verified trip to be exchanged for campus rewards (Free Lunch/Certificates).

### 2. The Passenger

This role are for students who need a ride and want to save money while contributing to a Green Campus.
- **Search & Filter:** Can view a list of available rides and filter by destination (e.g., "To Kampus Pusat" or "To Keputih").
- **Book Ride:** Clicks "Join" to reserve a seat.
- **Generate Token:** Upon booking, receives a **Unique 4-Digit Verification Code** (OTP) that must be kept secret until arrival.
- **Rewards:** Earns participation points (+5) for choosing a shared ride over a private taxi.

This is the detailed technical breakdown you requested. This section moves beyond the "what" and explains the **"how"**—mapping every feature to its specific code implementation and purpose.

You can use this to flesh out your **System Architecture** or **Technical Specification** section in your report or README.

---

## E. Detailed Feature & Component Breakdown

### 1. Authentication & Gatekeeping System

**Purpose:** To ensure safety by restricting access strictly to verified ITS students and managing secure user sessions.

- **Feature: Domain-Locked Registration**
    - **Technical Component (Backend API):** Controller-Level Input Validation.
    - **Detail:** The Registration API controller manually verifies if the email input ends with `@student.its.ac.id` or `@its.ac.id` _before_ attempting to create a user in the database. If the validation fails, the API throws a `400 Bad Request`, preventing the Prisma call entirely.
        
- **Feature: Secure Password Storage**
    - **Technical Component (Library):** `bcrypt` (Node.js).
    - **Detail:** Passwords are never stored in plain text. When a user registers, `bcrypt.hash()` salts and hashes the password. During login, `bcrypt.compare()` verifies the input without revealing the actual password.
        
- **Feature: Stateless Session Management**
    - **Technical Component (Standard):** JSON Web Token (JWT).
    - **Detail:** Upon successful login, the server generates a signed JWT containing the user's `ID` and `Role`. This token is sent to the Frontend and stored in `localStorage`. Every subsequent request (like "Create Ride") sends this token in the Header (`Authorization: Bearer <token>`) to prove identity without re-logging in.

### 2. The "Ride Board" (Core CRUD Module)

**Purpose:** The central marketplace where rides are created, displayed, and managed.

- **Feature: Dynamic Ride Posting (Create)**
    - **Technical Component (Backend):** POST `/api/rides` Endpoint (Prisma Client).
    - **Detail:** Receives form data (Destination, Time, Pickup Point, Capacity). It uses `prisma.ride.create()` and automatically links the `driverId` from the JWT token, ensuring the system enforces relational integrity between User and Ride models.
        
- **Feature: Intelligent Feed & Filtering (Read)**
    - **Technical Component (Database):** Prisma Filtering & Querying.
    - **Detail:** The dashboard uses precise filtering to show relevant data.
        - _Query Logic:_ `prisma.ride.findMany({ where: { status: 'OPEN', departureTime: { gte: new Date() } } })`.
        - _Result:_ This ensures users only see rides that are currently available and scheduled for the future.
    - **Frontend Component:** A "Search/Filter Bar" that updates the API query params (e.g., `?destination=Keputih`) to filter results instantly.
        
- **Feature: Seat Inventory Management (Update)**
    - **Technical Component (Logic):** Prisma Atomic Operations.
    - **Detail:** When a user clicks "Book," the backend performs a safe atomic update using `data: { seatsAvailable: { increment: -1 } }`. This guarantees that the seat count is accurate even if multiple users try to book simultaneously.

### 3. The "OTP Trust" Verification System

**Purpose:** To verify that a ride actually happened without using GPS, triggering the reward distribution.

- **Feature: Secure Token Generation**
    - **Technical Component (Logic):** Random String Generator (Crypto/Math).
    - **Detail:** When a Passenger successfully books a seat, the backend generates a random 4-digit string (e.g., `"4821"`). This code is saved in the **Passenger's Booking Ticket** (visible only to them) and the **Ride Record** in MongoDB (hidden from the driver initially).
        
- **Feature: Verification Endpoint**
    
    - **Technical Component (API):** POST `/api/rides/:id/verify`.
    - **Detail:** This endpoint accepts the `rideId` and the `code` input by the driver.
        - _Logic:_ It compares `InputCode === StoredCode`.
        - _If Match:_ It triggers the **Transaction Protocol** (see below).
        - _If Fail:_ Returns an error "Invalid Code."

### 4. Media & Identity Verification (File Handling)

**Purpose:** To provide visual proof of vehicle safety and driver identity.

- **Feature: Vehicle Photo Upload**
    - **Technical Component (Middleware):** `Multer` (Node.js Middleware).
    - **Detail:** Intercepts the "Create Ride" form request. It processes the image file, renames it with a unique timestamp (to prevent duplicate names), and stores it in a public `/uploads` folder.
        
- **Feature: Image Serving**
    - **Technical Component (Express):** Static File Serving (`express.static`).
    - **Detail:** The backend exposes the `/uploads` folder so the frontend can display images using a simple URL (e.g., `<img src="http://localhost:5000/uploads/honda-beat-123.jpg" />`).

### 5. The "Green Wallet" (Gamification Engine)

**Purpose:** To manage the incentives (Points) that drive the economy of the app.

- **Feature: Digital Wallet**
    - **Technical Component (Database Schema):** `greenPoints` Int field in Prisma User Model.
    - **Detail:** Every user profile has a `greenPoints` field (Integer) that starts at 0.
        
- **Feature: Transaction Logic**
    
    - **Technical Component (Backend Controller):** Prisma Transactions (`$transaction`).
    - **Detail:** This is triggered strictly by the **OTP Verification** success. It uses `prisma.$transaction()` to ensure both updates happen successfully or not at all:
        1. `prisma.user.update({ where: { id: driverId }, data: { greenPoints: { increment: 15 } } })`
        2. `prisma.user.update({ where: { id: passengerId }, data: { greenPoints: { increment: 5 } } })`
            
    - **Why Important:** This ensures data consistency; points are never "lost" or "doubled" due to server errors.

### 6. Communication Bridge (UX Feature)

**Purpose:** To facilitate coordination without building a complex chat app.

- **Feature: WhatsApp Deep Linking**
    - **Technical Component (Frontend Logic):** URL Construction.
    - **Detail:** The app stores the Driver's phone number in the database. When a Passenger books, the Frontend dynamically generates a link: `https://wa.me/<DriverPhone>?text=Halo, I booked a seat for your ride to Campus!`
    - Clicking this opens the native WhatsApp app immediately.

---

### Summary of Data Flow (How they connect)

1. **User** logs in → **Auth System** issues Token.
2. **Driver** uploads car photo → **Media Module** saves file → **CRUD Module** creates Ride entry (Prisma) with file URL.
3. **Passenger** books ride → **CRUD Module** updates seat count (Atomic Increment) → **OTP Module** generates Code.
4. **Ride** happens → **Driver** inputs Code → **OTP Module** verifies → **Wallet Module** updates points (Prisma Transaction).

## F. Directory Structure

```txt
.
├── package.json                 # Root scripts (e.g., "dev": "pnpm -r run dev")
├── pnpm-workspace.yaml          # Defines the monorepo workspaces
├── pnpm-lock.yaml
├── README.md                    # The documentation we wrote earlier
├── ./images                     # Screenshots for your README
│   ├── dashboard-preview.png
│   ├── ride-detail.png
│   └── verification-flow.png
└── ./packages
    ├── ./client                 # 🎨 FRONTEND (React + Vite)
    │   ├── index.html
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── src
    │       ├── main.tsx
    │       ├── App.tsx
    │       ├── assets
    │       ├── components       # Shared UI Components
    │       │   ├── Layout       # Navbar, Sidebar, Footer
    │       │   ├── Inputs       # Text fields, Dropdowns
    │       │   ├── Cards        # RideCard, DriverInfoCard
    │       │   ├── Modals       # "Join Ride" Confirmation Modal
    │       │   └── PrivateRoute.tsx
    │       ├── features         # Feature-Based Architecture
    │       │   ├── auth         # Login/Register Logic
    │       │   │   ├── components
    │       │   │   └── hooks
    │       │   ├── rides        # Core Ride Logic
    │       │   │   ├── components
    │       │   │   │   ├── RideList.tsx
    │       │   │   │   ├── CreateRideForm.tsx
    │       │   │   │   └── VerificationInput.tsx  # Input for OTP
    │       │   │   └── hooks    # useRides.ts
    │       │   ├── wallet       # Green Points Logic
    │       │   │   └── components
    │       │   │       └── PointsBadge.tsx
    │       │   └── profile
    │       │       └── components
    │       │           └── VehicleUpload.tsx      # Car Photo Upload
    │       ├── pages            # Route Pages
    │       │   ├── LoginPage.tsx
    │       │   ├── DashboardPage.tsx
    │       │   ├── CreateRidePage.tsx
    │       │   └── RideDetailPage.tsx
    │       └── services         # API Axios Calls
    │           └── api.ts       # Axios instance with Interceptors
    │
    ├── ./server                 # ⚙️ BACKEND (Express + Prisma)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── prisma
    │   │   ├── schema.prisma    # Your User & Ride Database Models
    │   │   └── seed.ts          # The "Demo Data" script
    │   ├── uploads              # 📁 Public folder for Vehicle Images
    │   └── src
    │       ├── server.ts        # App Entry Point
    │       ├── config
    │       │   └── db.ts        # Prisma Client Instance
    │       ├── middleware
    │       │   ├── auth.middleware.ts   # JWT Verification
    │       │   └── upload.middleware.ts # Multer (Image Handling)
    │       ├── controllers      # Request Logic
    │       │   ├── auth.controller.ts   # Login/Reg (Domain Validation)
    │       │   ├── ride.controller.ts   # CRUD + OTP Logic
    │       │   └── user.controller.ts   # Points/Wallet Logic
    │       ├── routes           # API Endpoints
    │       │   ├── auth.routes.ts
    │       │   ├── ride.routes.ts
    │       │   └── user.routes.ts
    │       └── utils
    │           └── otpGenerator.ts      # The 4-digit code logic
    │
    └── ./shared                 # 🔗 SHARED TYPES (Single Source of Truth)
        ├── package.json
        ├── tsconfig.json
        └── src
            ├── index.ts
            └── types
                ├── user.types.ts    # interface IUser { id, email, points... }
                └── ride.types.ts    # interface IRide { id, destination... }
```

### 1. Root & Configuration

The project uses a **Monorepo** structure managed by `pnpm`
- **`pnpm-workspace.yaml`**: Configures the workspace to treat `packages/client`, `packages/server`, and `packages/shared` as linked modules. This allows the Client to import types directly from Shared without publishing to npm.

### 2. `packages/client` (Frontend)

Built with **React + Vite + TypeScript**. It follows a **Feature-Based Architecture** where files are grouped by business logic (Auth, Rides, Wallet) rather than just file type
- **`src/features/rides`**: Contains everything related to the core "Nebeng" functionality.
    - **`VerificationInput.tsx`**: The specific UI component where drivers input the OTP code.  
- **`src/features/profile/VehicleUpload.tsx`**: Handles the file selection and preview for the driver's car photo before sending it to the backend.
- **`src/services/api.ts`**: A centralized Axios instance that automatically attaches the `Authorization: Bearer <token>` header to every request.

### 3. `packages/server` (Backend)

Built with **Express.js + Prisma + MongoDB**
- **`prisma/schema.prisma`**: The single source of truth for the database structure. It defines the `User` (with Green Points) and `Ride` (with OTP code) models.
- **`prisma/seed.ts`**: A script used to populate the database with dummy data (e.g., Driver Budi and Passenger Siti) for demonstration purposes.
- **`src/controllers/ride.controller.ts`**: The "Brain" of the app. It handles:
    - Filtering rides (`findMany`).
    - Atomic seat updates (preventing double booking).
    - **OTP Verification:** The logic that compares `inputCode === storedCode`.
- **`src/middleware/upload.middleware.ts`**: Configures **Multer** to save uploaded vehicle photos into the local `/uploads` directory with unique filenames.

### 4. `packages/shared` (Common)

A utility package containing **TypeScript Interfaces**
- **Purpose:** To ensure the Frontend and Backend "speak the same language."
- **Example:** If we change the `Ride` model in the backend, the frontend will immediately show a TypeScript error if it tries to access a deleted field, preventing runtime bugs.

---

## G. Tech Stack

To ensure scalability, type safety, and a seamless developer experience, this project is built using a modern **Modified MERN Stack** within a **Monorepo** architecture.

### 1. Monorepo & Language

- **Language: TypeScript** * 
- _Reason:_ Used across the entire stack (Frontend, Backend, and Shared) to ensure strict type safety. We use a `packages/shared` workspace to share interfaces (e.g., `IUser`, `IRide`) between client and server, preventing data mismatch errors.

- **Package Manager:** **pnpm (Workspaces)**
    - _Reason:_ Chosen for its efficiency and built-in support for monorepos, allowing us to manage multiple packages (`client`, `server`, `shared`) in a single repository.

### 2. Frontend (Client)

- **Framework: React.js** (via **Vite**)
- _Reason:_ Vite provides lightning-fast HMR (Hot Module Replacement) compared to CRA. React is used for its component-based architecture, making it easy to reuse UI elements like `RideCard` and `Navbar`.

- **Styling: Tailwind CSS**
- _Reason:_ Utility-first CSS allows for rapid UI development and ensures the application is fully responsive on mobile devices (crucial for students on the go).

- **State & Networking:** **Axios** + **React Hooks**
    - _Reason:_ Axios is configured with interceptors to automatically attach the JWT Token to every request, simplifying authentication logic.

### 3. Backend (Server)

- **Runtime:** **Node.js** + **Express.js**
        - _Reason:_ Lightweight and flexible REST API architecture that handles high concurrency for ride requests.
- **ORM (Object-Relational Mapping):** **Prisma**
    - _Reason:_ Replaces traditional Mongoose. Prisma provides auto-generated type definitions based on our schema, ensuring that our database queries are bug-free at compile time.
- **Authentication:** **JWT** (JSON Web Tokens) + **Bcrypt**
    - _Reason:_ Stateless authentication is perfect for scaling. Passwords are hashed with Bcrypt to ensure security standards.
- **File Handling:** **Multer**
    - _Reason:_ Middleware used to handle `multipart/form-data` for vehicle photo uploads, storing them securely in the local server directory.

### 4. Database

- **Database:** **MongoDB**
    - _Reason:_ A NoSQL document store is ideal for this application because the data structure for `Rides` (which might include varying passenger lists or future metadata) benefits from a flexible schema.

---

## H. Database Schema

The application uses **MongoDB** as the primary data store, chosen for its document-based structure which allows for flexible data modeling. However, to ensure data integrity and type safety within our application, we utilize **Prisma ORM** to define strict schemas and relationships.

Below is the logical data model governing the application:

### 1. User Model (`User`)

**Purpose:** Stores all authentication data, profile information, and the "Green Wallet" balance.
- **Role in System:** The central entity. A user can act as both a Driver (creating rides) and a Passenger (booking rides).

| **Field**     | **Type**   | **Description**                                                   |
| ------------- | ---------- | ----------------------------------------------------------------- |
| `id`          | `ObjectId` | Unique identifier (Auto-generated by MongoDB).                    |
| `email`       | `String`   | **Unique.** Must end in `@student.its.ac.id`.                     |
| `password`    | `String`   | Hashed via Bcrypt.                                                |
| `name`        | `String`   | Full name of the student.                                         |
| `role`        | `String`   | `STUDENT` or `ADMIN`.                                             |
| `greenPoints` | `Int`      | **Gamification.** Starts at 0. Increments upon ride verification. |
| `ridesDriven` | `Relation` | List of rides created by this user (One-to-Many).                 |
| `ridesTaken`  | `Relation` | List of rides this user has booked (Many-to-Many).                |

### 2. Ride Model (`Ride`)

**Purpose:** Represents a single trip offered by a driver. It contains the "Inventory" (seats) and the "Security" (OTP code).

| **Field**          | **Type**   | **Description**                                            |
| ------------------ | ---------- | ---------------------------------------------------------- |
| `id`               | `ObjectId` | Unique identifier.                                         |
| `driverId`         | `ObjectId` | Reference to the `User` who owns the car.                  |
| `destination`      | `String`   | e.g., "Kampus Pusat", "Asrama", "Galaxy Mall".             |
| `pickupPoint`      | `String`   | Specific meeting location (e.g., "Indomaret Gebang").      |
| `departureTime`    | `DateTime` | When the ride starts. Used for filtering "Future Rides".   |
| `seatsAvailable`   | `Int`      | Inventory count. Decreases when a passenger books.         |
| `vehiclePhotoUrl`  | `String`   | URL to the uploaded verification image.                    |
| `status`           | `String`   | `OPEN`, `FULL`, `COMPLETED`, `CANCELLED`.                  |
| `verificationCode` | `String`   | **Hidden.** The 4-digit OTP required to complete the ride. |
| `passengers`       | `Relation` | List of `User` IDs who have booked a seat.                 |

### 3. Entity Relationship Diagram (ERD) Conceptualization

Since MongoDB is document-based, the relationships are handled via references (`@relation` in Prisma).

- **One-to-Many (Driver -> Rides):**
    - One **User** (Driver) can create **Many** Rides.
- **Many-to-Many (Passenger <-> Rides):**
    - One **User** (Passenger) can book **Many** Rides.
    - One **Ride** can have **Many** Passengers.
    - _Note:_ In Prisma + MongoDB, this is efficiently handled by storing an array of IDs (`passengerIdsString[]`) on the Ride document.

### 4. Prisma Schema Definition

This is the actual code representation used in the `packages/server/prisma/schema.prisma` file:

```
model User {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  email       String   @unique
  greenPoints Int      @default(0)
  
  // Relations
  ridesDriven Ride[]   @relation("DriverRides")
  ridesTaken  Ride[]   @relation("PassengerRides", fields: [rideIds], references: [id])
  rideIds     String[] @db.ObjectId
}

model Ride {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  destination     String
  status          RideStatus @default(OPEN)
  
  // The OTP Logic
  verificationCode String 
  
  // Relations
  driver          User     @relation("DriverRides", fields: [driverId], references: [id])
  driverId        String   @db.ObjectId
  
  passengers      User[]   @relation("PassengerRides", fields: [passengerIds], references: [id])
  passengerIds    String[] @db.ObjectId
}
```

---

## I. API Endpoints

The backend provides a RESTful API reachable at `http://localhost:5000/api`. All endpoints (except Login/Register) require the `Authorization: Bearer <token>` header.

### 1. Authentication (`/api/auth`)

These endpoints handle user access and security.

|Method|Endpoint|Description|Access|
|---|---|---|---|
|`POST`|`/register`|Registers a new user. Requires an ITS email domain (`@student.its.ac.id`).|Public|
|`POST`|`/login`|Authenticates a user and returns a JWT Token + User Profile.|Public|

### 2. User Management (`/api/users`)

Endpoints for retrieving user-specific data.

|Method|Endpoint|Description|Access|
|---|---|---|---|
|`GET`|`/me`|Fetches the currently logged-in user's profile (Name, Role, Green Points).|**Private** (Token required)|

### 3. Ride Operations (`/api/rides`)

The core functionality for the Nebeng system.

| Method | Endpoint      | Description                                                                                               | Access                    |
| ------ | ------------- | --------------------------------------------------------------------------------------------------------- | ------------------------- |
| `GET`  | `/`           | **The "Feed".** Returns a list of all _open_ and _future_ rides. Supports filtering by destination.       | **Private**               |
| `POST` | `/`           | **Create Ride.** A Driver posts a new ride. Handles image upload for the vehicle photo.                   | **Private**               |
| `POST` | `/:id/book`   | **Book Seat.** A Passenger joins a ride. Decrements seat count and returns the Secret OTP.                | **Private**               |
| `POST` | `/:id/verify` | **Complete Ride.** The Driver submits the OTP code. If correct, distributes Green Points to both parties. | **Private** (Driver only) |

### 4. Image Serving (`/uploads`)

- **URL:** `http://localhost:5000/uploads/<filename>`
- **Purpose:** Serves the static vehicle images uploaded by drivers.

---

## J.  How to Run This Project (Fork & Setup)

Follow these steps to get a local copy up and running.

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (Install via `npm i -g pnpm`)
- **MongoDB** (Local instance or Atlas URI)

### 1. Fork & Clone

1. Click the **Fork** button at the top-right of this repository to create your own copy.
2. Clone your forked repository:
    
	```
	git clone https://github.com/YOUR_USERNAME/web-nebengits.git
	cd web-nebengits
	```
    

### 2. Install Dependencies

Since this is a monorepo, install dependencies from the root:

```
pnpm install
```

### 3. Configure Environment Variables

You need to set up environment variables for both the client and server.

**Server (`packages/server`)**

1. Go to the server directory: `cd packages/server`
2. Copy the example env file: `cp .env.example .env`
3. Update `.env` with your details:
    
    ```
    PORT=5000
    DATABASE_URL="mongodb://localhost:27017/nebengits?authSource=admin" # Or your Atlas URI
    JWT_SECRET="supersecretkey123"
    ```
    

**Client (`packages/client`)**

1. Go to the client directory: `cd ../client` (from server) or `cd packages/client` (from root)
2. Create a `.env` file (if needed, though Vite defaults usually work):
    
    ```
    VITE_API_URL="http://localhost:5000/api"
    ```
    

### 4. Database Setup & Seeding

This project uses Prisma. You need to push the schema to your database and seed it with initial data.

From the **root** directory:

1. **Generate Prisma Client**:
    
    ```
    pnpm prisma:generate
    ```
    
2. **Push Schema to DB**:
    
    ```
    pnpm prisma:push
    ```
    
3. **Seed the Database** (Crucial!): This script creates dummy users (Budi, Siti, etc.) and rides so you don't start with an empty app.
    
    ```
    pnpm prisma:seed
    ```
    
    _Note: The seed script will print out login credentials (email/password) for test accounts._
    

### 5. Run the App

You can run both frontend and backend concurrently from the root:

```
pnpm dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost

## K. How to Test the Flow

1. **Login as a Driver**:
    
    - Use `budi@student.its.ac.id` / `password123`.
    - Go to **"My Posted Rides"** to see rides you offer.
    - Or click **"Offer a Ride"** to create a new one.
        
2. **Login as a Passenger** (Incognito window):
    
    - Use `ani@student.its.ac.id` / `password123`.
    - Browse the **Dashboard**. You won't see Budi's rides if you already booked them (check "My Booked Rides").
    - Find a new ride and click **"Book Seat"**.
    - Go to **"My Booked Rides"**, click the ride, and copy the **Ticket Code**.
        
3. **Verify the Ride**:
    
    - Switch back to **Driver Budi**.
    - Go to **"My Posted Rides"** -> Click the ride Ani just booked.
    - Enter the Ticket Code in the **Driver Dashboard** box.
    - Click **Verify**. Both users will get Green Points!