# Smart Employee Management System (Enterprise HRMS)

Full-stack HRMS: **React + Tailwind (frontend)** and **Spring Boot + Spring Security (JWT) + JPA/Hibernate + MySQL (backend)**.

## What's included
- JWT authentication + Role-Based Access Control (ADMIN / EMPLOYEE)
- Employee, Department, Designation CRUD with pagination & search
- Attendance (self check-in/out + admin marking)
- Leave management (apply, approve/reject, cancel)
- Announcements
- Profile management + profile image upload
- Dashboard with charts (Recharts)
- Global exception handling, Bean Validation, soft delete, audit fields (createdAt/updatedAt)
- Swagger/OpenAPI docs at `/swagger-ui.html`

## Prerequisites
- Java 17+, Maven 3.9+
- Node.js 18+
- MySQL 8 running locally

## 1. Backend setup

```bash
cd backend
```

Create the database (auto-created on first run via `createDatabaseIfNotExist=true`), just make sure MySQL is running and update credentials in:

`src/main/resources/application.yml`
```yaml
spring:
  datasource:
    username: root
    password: root   # <-- change to your MySQL password
```

Run it:
```bash
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**.

A default admin account is auto-created on first run:
- **username:** `admin`
- **password:** `Admin@123`

API docs: http://localhost:8080/swagger-ui.html

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173** and proxies `/api` calls to the backend (see `vite.config.js`).

## Login
- Sign in as `admin` / `Admin@123` for the full admin dashboard.
- Or click "Register" to create an employee account (auto role: EMPLOYEE, auto-creates linked employee profile).

## Project structure

```
backend/
  src/main/java/com/hrms/
    config/       # Security, CORS, Swagger, seed data, static file serving
    controller/   # REST controllers
    dto/          # Request/response DTOs
    entity/       # JPA entities
    exception/    # Global exception handling
    repository/   # Spring Data JPA repositories
    security/     # JWT provider, filter, UserDetails
    service/      # Business logic

frontend/
  src/
    pages/        # Route-level pages
    components/   # Reusable UI (Modal, Pagination)
    services/     # Axios API modules
    context/      # AuthContext (JWT session)
    layouts/      # Sidebar + topbar shell
    routes/       # ProtectedRoute (auth + RBAC guard)
```

## What's new (v3)
- **Payroll/Salary module**: admin generates monthly salary (basic + allowances - deductions = net), marks as paid; employees see their own salary history under "My Salary"
- **Dark mode**: toggle in the sidebar, persisted across sessions (`localStorage`)
- **Leave trends chart**: Reports page now shows a leave-status breakdown (pending/approved/rejected/cancelled) alongside the department headcount chart

## What's new (v2)
- **Professional UI**: refreshed color system, Inter typeface, elevated cards, polished login/sidebar
- **Excel export**: "Export Excel" button on the Employees page (`GET /api/employees/export`, powered by Apache POI)
- **Silent token refresh**: the frontend now auto-refreshes an expired access token via `/api/auth/refresh` instead of logging the user out
- **Docker**: `docker-compose.yml` at the project root spins up MySQL + backend + frontend with one command:
  ```bash
  docker compose up --build
  ```
  Frontend → http://localhost, Backend → http://localhost:8080
- **Unit tests**: `EmployeeServiceTest` and `JwtTokenProviderTest` under `backend/src/test` (JUnit 5 + Mockito + AssertJ) — run with `mvn test`
- **`/api/employees/me`**: reliable "who am I" endpoint used by the Profile and Attendance pages (fixes the earlier username-search bug)

## Extending this further
Natural next additions:
- Department/Designation dropdown caching
- PDF export for reports
- Email notifications on leave approval
- i18n (Tamil/English toggle)

## Interview talking points this project demonstrates
JWT auth & RBAC, One-to-Many / Many-to-One JPA relationships, REST API design, Bean Validation + centralized exception handling, pagination/sorting/filtering, file upload, soft delete pattern, audit fields via `@EntityListeners`, and a clean layered architecture (controller → service → repository).
