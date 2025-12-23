# 🌍 Carbon Footprint Calculator for Households

**GitHub ID:** `@thissidemayur`
**Project Link:** [https://github.com/thissidemayur/carbobFootprintCalculator](https://github.com/thissidemayur/carbobFootprintCalculator)
**Live Link:** [Insert Live Deployment Link Here]

## 1. Project Overview

This is a full-stack platform designed to empower households to measure, track, and effectively reduce their carbon footprint ($\text{CO}_2\text{e}$). The application provides personalized recommendations based on user-submitted activity data (energy, transport, waste, and consumption). The platform includes a robust administrative panel for data analysis and emission factor management.

## 2. Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | Node.js, Express.js | Robust, scalable RESTful API |
| **Database** | MongoDB (via Mongoose) | Flexible, persistent storage for logs and user data |
| **Cache/Metrics** | Redis | High-speed leaderboards (Sorted Sets), rate limiting, and session management |
| **Architecture** | **Service-Repository Pattern** | Clean separation of concerns (DB logic, Business logic, API layer) |
| **Validation** | Zod | Runtime schema validation for secure and type-safe data handling |
| **Security** | JWT, Bcrypt, Role-Based Access Control (RBAC) | Authentication and authorization |

## 3. Core Features

### User Functionality (Authenticated)
* **Registration/Login:** Secure token-based authentication.
* **Calculation:** Submits household activity data (kWh, km, spending) and instantly calculates total $\text{CO}_2\text{e}$ and breakdown.
* **Tracking:** Views historical footprint trends and progress over time.
* **Account:** Secure profile and password management.

### Administrator Functionality
* **Analytics:** Global average footprint, total users, and real-time Top/Bottom 10 performance leaderboards (powered by Redis).
* **Data Filtering:** Aggregated analysis of logs by region, home size, and consumption patterns.
* **Factor Management:** CRUD operations on all `EmissionFactors` to ensure calculation accuracy.

## 4. Setup and Installation

### Prerequisites

* Node.js (v18+)
* MongoDB Instance (Local or Atlas)
* Redis Instance (Local or Cloud)

### Environment Configuration

Create a `.env` file based on the template in the root directory and ensure all database and secret keys are set.

### Steps

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/thissidemayur/carbobFootprintCalculator](https://github.com/thissidemayur/carbobFootprintCalculator)
    cd carbobFootprintCalculator/server
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Run the Server**
    ```bash
    npm start # Use your preferred script for development (e.g., npm run dev)
    ```

## 6. project strucutre
```
/server
├── /config
│   ├── index.js             # Centralized environment variable management
│   ├── mongo.js             # Database connection setup for MongoDB
│   └── redis.js             # Database connection setup for Redis
├── /constants
│   └── index.js             # Static variables: error codes, user roles (e.g., ADMIN, USER)
├── /controllers
│   ├── auth.controller.js   # Handles request/response for auth routes
│   ├── user.controller.js           # NEW: Profile fetching/update
│   ├── footprint.controller.js      # NEW: Core user calculation/history
│   ├── admin.controller.js          # NEW: Admin analytics/summary
│   └── emissionFactor.controller.js # NEW: Admin factor management
├── /middlewares
│   ├── auth.middleware.js   # JWT verification (isAuth)
│   ├── role.middleware.js   # Role-based access control (hasRole)
│   ├── rateLimiter.js       # Global and specific rate limiting
│   ├── errorHandler.js      # Centralized error handling
│   ├── validation.js        # NEW: Zod schema validation middleware
│   └── inputSanitixation.js # Input sanitization logic
├── /models
│   ├── User.js              # Mongoose Schema and Model (Auth/Profile)
│   ├── EmissionFactor.js          # NEW: Reference data model (Calculation constants)
│   └── FootprintLog.js            # NEW: Time-series log data model (User results)
├── /repositories
│   ├── user.repository.js   # Direct DB interaction for User model
│   ├── emissionFactor.repository.js # NEW: Factor DB operations
│   └── footprintLog.repository.js   # NEW: Footprint log DB operations
├── /routes
│   ├── auth.routes.js       # Express routes for authentication
│   ├── user.route.js              # NEW: Profile routes
│   ├── footprint.routes.js        # NEW: Calculation routes
│   ├── admin.routes.js            # NEW: Admin analytics routes
│   ├── factor.routes.js           # NEW: Factor management routes
│   └── index.js             # Central route aggregator
├── /services
│   ├── auth.service.js      # Business logic: login, register, token rotation
│   ├── jwt.service.js       # Logic for generating, verifying JWTs
│   ├── bcrypt.js            # Logic for password hashing and comparison
│   ├── user.service.js              # NEW: Profile management logic
│   ├── calculation.service.js       # NEW: Core CFP formula engine
│   ├── footprint.service.js         # NEW: Calculation orchestration/Redis update
│   ├── admin.service.js             # NEW: Admin dashboard data logic
│   └── emissionFactor.service.js    # NEW: Factor management logic
├── /utils
│   ├── ApiError.js          # Custom error class for consistent handling
│   ├── apiResponse.js       # Standardized response wrapper
│   └── asyncHandler.js      # Utility to wrap controllers for error catching
├── /validators
│   ├── auth.validator.js            # Zod schemas for login/register
│   ├── user.validator.js            # Zod schemas for profile/password
│   ├── footprint.validator.js       # Zod schemas for CFP input
│   └── emissionFactor.validator.js  # Zod schemas for factor management
│
├── app.js                   # Express application setup
├── server.js                # Server entry point (starts app.js)
├── package.json
└── .env                     # Environment variables (IGNORED BY GIT)
```

## 6. Documentation and Design

To provide a comprehensive overview for evaluation, the following documentation files are included:

### [`API.md`](./API.md) 
Details the complete contract for all REST endpoints, including request bodies, authentication requirements, query parameters, and example response payloads. This is essential for frontend integration and external testing (Postman).

### [`ARCHITECTURE.md`](./ARCHITECTURE.md) 
Explains the architectural decisions made: the **Service-Repository Pattern**, the role of the **Calculation Service**, the use of **Redis Sorted Sets** for leaderboards, and the **environmental logic** underpinning the $\text{CO}_2\text{e}$ calculations.

---

### 7. Environmental Logic & Calculation Foundation

The carbon footprint calculation is based on the GFA (Greenhouse Gas Footprint Assessment) standard:

$$
\text{Carbon Footprint (kg } \text{CO}_2\text{e}) = \sum_{\text{Activity}} (\text{Activity Data} \times \text{Emission Factor})
$$

The `EmissionFactor` database table allows administrators to dynamically adjust the factors ($\text{kg} \text{CO}_2\text{e}/\text{unit}$) for localized or updated emissions standards.