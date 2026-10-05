# Chapter 3: Database Access with JPA and Hibernate

## What I built

- `Car` entity mapped to a database table with `@Entity`, `@Id` and `@GeneratedValue`.
- `@Column(name = "car-year")` to rename the `year` column, since `year` is a reserved word in some databases.
- `CarRepository` extending `CrudRepository<Car, Long>`, which gives save, find, delete and count methods without writing any SQL.
- A `CommandLineRunner` in the main application class that inserts sample cars at startup and logs them.
- H2 in-memory database with the web console enabled at `/h2-console`.

## Key takeaways

- Spring Data JPA generates repository implementations at runtime from the interface alone.
- `spring.jpa.show-sql=true` prints the generated SQL, which is useful for seeing what Hibernate does.
- An in-memory database resets on every restart, which is fine for learning but not for real data.

## Questions / to revisit

-
