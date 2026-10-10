# Full Stack Car Database (Spring Boot + React)

A full stack car database application built while working through
_Full Stack Development with Spring Boot and React_ by Juha Hinkula.
The backend is a Spring Boot REST service and the frontend (coming in later chapters) is a React app that consumes it.

## Tech Stack

| Layer    | Technologies                                         |
| -------- | ---------------------------------------------------- |
| Backend  | Java 27, Spring Boot 4.1, Spring Data JPA, Hibernate |
| Database | H2 (in-memory, development)                          |
| Build    | Maven (wrapper included)                             |
| Frontend | React, TypeScript (planned)                          |

## Project Structure

```
fullstack-springboot-react/
├── cardatabase/   Spring Boot backend
├── carfront/      React frontend (later chapters)
└── docs/notes/    Short notes on what I learned in each chapter
```

## Running the Backend

```bash
cd cardatabase
./mvnw spring-boot:run
```

- App: http://localhost:8080
- H2 console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:testdb`)

## Progress

| Chapter | Topic                                  | Status         | Tag    |
| ------- | -------------------------------------- | -------------- | ------ |
| 1       | Setting up the environment and tools   | ✅ Done        | `ch03` |
| 2       | Dependency injection                   | ✅ Done        | `ch03` |
| 3       | Database access with JPA and Hibernate | ✅ Done        | `ch03` |
| 4       | RESTful web service                    | ⏳ Next        |        |
| 5       | Securing the backend                   | ⬜ Not started |        |
| 6       | Testing the backend                    | ⬜ Not started |        |
| 7+      | React frontend                         | ⬜ Not started |        |

Each finished chapter is tagged, so the code at any point can be viewed with `git checkout chNN`.

## Workflow

- One branch per chapter (`ch04-rest-api`, `ch05-security`, ...), merged into `main` when done.
- An annotated tag (`ch04`, `ch05`, ...) marks the end of each chapter.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

## Beyond the Book

Extras I add on top of the book's material will be listed here.

- Sample data uses Kenyan market cars and local registration plate formats.
