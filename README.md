# Boutique — React + Spring Boot E-Commerce

A full-stack e-commerce demo project: a React storefront/admin dashboard backed by a Spring Boot REST API.

## Tech Stack

**Frontend** (`mon-projet-react/`)
- React 19 + Vite
- React Router
- Axios
- Bootstrap / Tailwind CSS

**Backend** (`project-fullstack/`)
- Java 25, Spring Boot 4
- Spring Data JPA (Hibernate)
- MySQL
- springdoc-openapi (Swagger UI)

## Project Structure

```
.
├── mon-projet-react/     # React frontend (storefront + admin dashboard)
└── project-fullstack/    # Spring Boot backend (REST API)
```

## Features

- **Storefront**: browse products by category, search, add/remove items from a per-user cart, view cart total.
- **Admin dashboard**: manage products, categories, and users.
- **REST API**: users (register/login/roles), products, categories, and cart, backed by MySQL via JPA.

## Prerequisites

- Java 25 (JDK)
- Node.js 18+ and npm
- A running MySQL (or MariaDB) server on `localhost:3306`

## Getting Started

### 1. Database

Create the database used by the backend (see `project-fullstack/src/main/resources/application.properties` for connection details — defaults to `root` user, no password):

```sql
CREATE DATABASE IF NOT EXISTS test1;
```

The backend uses `spring.jpa.hibernate.ddl-auto=create`, so tables are (re)created automatically on every startup, and a couple of demo users/products/categories are seeded via `ProjectFullstackApplication.main`.

### 2. Backend

```bash
cd project-fullstack
./mvnw spring-boot:run
```

The API starts on **http://localhost:8080**. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd mon-projet-react
npm install
npm run dev
```

Vite will start on the first free port starting at `5173` (printed in the terminal). The backend's CORS config accepts any `http://localhost:*` origin, so no extra configuration is needed regardless of which port Vite picks.

Open the printed URL in your browser:
- `/` — customer storefront
- `/admin` — admin dashboard

## API Overview

| Resource   | Base path       |
|------------|-----------------|
| Users      | `/users`        |
| Products   | `/api/products` |
| Categories | `/api/category` |
| Cart       | `/api/cart`     |

## Notes

- Demo data (2 users, 1 category, 2 products) is reseeded on every backend restart.
- `AuthController`/`AuthService` and `OrderController` are present but not yet wired up — user auth currently goes through the `/users/login` and `/users/register` endpoints instead.
