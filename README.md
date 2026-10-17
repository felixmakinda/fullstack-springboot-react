# Full Stack Car Database (Spring Boot + React)

A full stack car inventory app built while working through
_Full Stack Development with Spring Boot and React_ (third edition) by Juha Hinkula,
using current versions of every tool instead of the ones in the book.

The backend is a Spring Boot REST API backed by MariaDB and secured with JWT. The frontend is a
React app where you log in, then list, add, edit, delete and export cars.

> New to full stack development? I wrote a walkthrough of how this app works, following one car
> from a button click to the database and back:
> [Anatomy of a Full-Stack Web App](https://makinda.vercel.app/blog/anatomy-of-a-full-stack-web-app).

## Tech Stack

| Layer    | Technologies                                                                              |
| -------- | ----------------------------------------------------------------------------------------- |
| Backend  | Java 27, Spring Boot 4.1, Spring Data JPA + REST, Hibernate, Spring Security 7, jjwt 0.13 |
| Database | MariaDB (app), H2 in-memory (tests)                                                       |
| Frontend | React 19, Vite 8, MUI 7, MUI X DataGrid 8, pnpm                                           |
| Testing  | JUnit 5, MockMvc, `@DataJpaTest` (backend); Vitest, React Testing Library (frontend)      |
| Tooling  | Maven wrapper, Prettier with the Java plugin                                              |

## Project Structure

```
fullstack-springboot-react/
├── cardatabase/   Spring Boot backend (REST API on http://localhost:8080)
├── carfront/      React frontend (Vite dev server on http://localhost:5173)
└── docs/notes/    Short notes on what I learned in each chapter
```

## Getting Started

### Prerequisites

- Java 27 (the Maven wrapper downloads Maven itself)
- Node.js 22.12 or newer, and pnpm
- MariaDB

### 1. Create the database

```sql
CREATE DATABASE cardb;
CREATE USER 'springboot'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cardb.* TO 'springboot'@'localhost';
FLUSH PRIVILEGES;
```

The backend reads the password from an environment variable, so it never appears in the code:

```bash
export DB_PASSWORD=your_password
```

### 2. Run the backend

```bash
cd cardatabase
./mvnw spring-boot:run
```

The tables are created on startup and filled with sample owners, cars and users
(`spring.jpa.hibernate.ddl-auto=create-drop`, so they are dropped again on shutdown).

### 3. Run the frontend

In a second terminal:

```bash
cd carfront
pnpm install
pnpm dev
```

Then open http://localhost:5173 and log in.

### 4. Log in

The sample accounts created on startup have private passwords, so add a demo account to try the
app. With the backend running, run this in MariaDB (the hash is the BCrypt hash of the password
`user`, the same one the book uses):

```sql
INSERT INTO cardb.`user` (username, password, role)
VALUES ('user', '$2a$10$NVM0n8ElaRgg7zWO1CxUdei7vWoPg91Lz2aYavh9.f9q0e4bRadue', 'USER');
```

Then log in as `user` / `user`. Because of `create-drop`, the account disappears when the backend
stops, so add it again after each restart.

## API

Spring Data REST exposes the repositories under `/api`:

| Action       | Request                 |
| ------------ | ----------------------- |
| List cars    | `GET /api/cars`         |
| Add a car    | `POST /api/cars`        |
| Update a car | `PUT /api/cars/{id}`    |
| Delete a car | `DELETE /api/cars/{id}` |
| List owners  | `GET /api/owners`       |
| Log in       | `POST /login`           |

`POST /login` takes `{"username": "...", "password": "..."}` and returns a JWT in the
`Authorization` header. Every other endpoint needs that header (`Authorization: Bearer <token>`)
and answers `401 Unauthorized` without a valid one. The frontend keeps the token in
`sessionStorage`, so it is cleared when the browser tab closes.

## Running the Tests

**Backend:**

```bash
cd cardatabase
./mvnw test
```

Backend tests use an in-memory H2 database (`src/test/resources/application.properties`), so they
need neither MariaDB nor `DB_PASSWORD`, and can run while the app is running. Besides the
repository tests, they check the security rules: logging in, rejecting a wrong password, and
rejecting requests with no token or a forged one.

**Frontend:**

```bash
cd carfront
pnpm test        # watch mode, reruns on save
pnpm test:run    # run once
```

Frontend tests run in Vitest with React Testing Library. They cover the login form (failed login,
successful login, log out), the add-car form, and a snapshot of `AddCar`.

## Formatting

Prettier formats Java, JavaScript and JSX. VS Code formats on save; from the repository root you
can also run:

```bash
npm install
npm run format        # format everything
npm run format:check  # report unformatted files
```

## Progress

| Chapter | Topic                                   | Status                         |
| ------- | --------------------------------------- | ------------------------------ |
| 1       | Setting up the environment and tools    | ✅ Done                        |
| 2       | Dependency injection                    | ✅ Done                        |
| 3       | Database access with JPA and Hibernate  | ✅ Done (tag `ch03`)           |
| 4       | RESTful web service                     | ✅ Done                        |
| 5       | Securing and testing the backend        | ✅ Done                        |
| 6–9     | React basics and third-party components | ⏭️ Skipped (learning material) |
| 10      | Setting up the frontend                 | ✅ Done                        |
| 11      | CRUD functionalities                    | ✅ Done                        |
| 12      | Styling the frontend with MUI           | ✅ Done                        |
| 13      | Testing the frontend                    | ✅ Done                        |
| 14      | Securing the application                | ✅ Done                        |
| 15      | Deploying the application               | ⏭️ Out of scope                |

## Differences From the Book

The third edition targets Spring Boot 2.6 and create-react-app. This project uses current versions,
which changed a fair amount of code:

- **Spring Security 7.** `WebSecurityConfigurerAdapter` no longer exists, so security is configured
  with a `SecurityFilterChain` bean and the lambda DSL. I wrote up the changes in
  [Spring Security Without WebSecurityConfigurerAdapter](https://makinda.vercel.app/blog/spring-security-without-websecurityconfigureradapter).
- **jjwt 0.13.** New builder and parser methods (`Jwts.parser().verifyWith(...)`,
  `parseSignedClaims(...)`, `Jwts.SIG.HS256.key()`).
- **`jakarta.*` instead of `javax.*`** for persistence and servlet imports.
- **MariaDB instead of H2 for the app**, with the password in an environment variable.
- **H2 only for tests**, with `NON_KEYWORDS=USER` because `user` is a reserved word in H2.
  `@DataJpaTest` moved to `spring-boot-starter-data-jpa-test` in Spring Boot 4.
- **Vite and pnpm instead of create-react-app.** Components use the `.jsx` extension, and the dev
  server runs on port 5173 instead of 3000.
- **MUI 7 and DataGrid 8.** DataGrid 8 does not yet support MUI 9. The CSV export uses DataGrid 8's
  `Toolbar`, `ExportCsv` and `ExportPrint` instead of the deprecated `GridToolbarExport`, and the
  Edit and Delete columns are left out of exports.
- **Registration numbers in the forms.** The backend's `Car` has a `registerNumber` field, so the
  add and edit forms include it instead of the book's `fuel` field.
- **Vitest instead of Jest.** create-react-app bundled Jest; Vite projects use Vitest, which has the
  same `test`/`expect` API. Snapshots use React Testing Library because `react-test-renderer` is
  deprecated in React 19, and the tests render `AddCar` directly because the app now opens on the
  login form.
- **Safer token handling.** An expired, forged or malformed token is treated as "not logged in"
  (401) instead of crashing the request, and the filter only authenticates requests whose token
  verified. `/error` is open so real errors such as 404 are not reported as 401.
- **Log out button.** The book writes a `logout` function but never shows it; here it is a button
  next to New Car. If the server rejects a saved token, the app returns to the login form.
- **Sample data** uses Kenyan market cars and local registration plate formats.

## Workflow

- Work happens on `main`; commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- Finished chapters can be tagged (`ch03` so far), so the code at that point can be viewed with
  `git checkout chNN`.
