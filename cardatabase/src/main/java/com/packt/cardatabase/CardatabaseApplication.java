package com.packt.cardatabase;

import com.packt.cardatabase.domain.Car;
import com.packt.cardatabase.domain.CarRepository;
import com.packt.cardatabase.domain.Owner;
import com.packt.cardatabase.domain.OwnerRepository;
import com.packt.cardatabase.domain.User;
import com.packt.cardatabase.domain.UserRepository;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CardatabaseApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(CardatabaseApplication.class);

    @Autowired
    private CarRepository repository;

    @Autowired
    private OwnerRepository orepository;

    @Autowired
    private UserRepository urepository;

    public static void main(String[] args) {
        SpringApplication.run(CardatabaseApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Add owner objects and save these to db
        Owner owner1 = new Owner("Felix", "Makinda");
        Owner owner2 = new Owner("Zipporah", "Kwamboka");
        Owner owner3 = new Owner("Lionel", "Mogendi");
        orepository.saveAll(Arrays.asList(owner1, owner2, owner3));

        Car car1 = new Car("Subaru", "Impreza", "White", "KDH481G", 2014, 12000, owner1);
        Car car2 = new Car("Toyota", "Corolla", "Silver", "KCA123A", 2018, 15000, owner1);
        Car car3 = new Car("Nissan", "Almera", "Black", "KCB456B", 2016, 13500, owner2);
        Car car4 = new Car("Hyundai", "Elantra", "Blue", "KCC789C", 2019, 16000, owner3);
        Car car5 = new Car("Honda", "Civic", "Red", "KCD012D", 2017, 14500, owner1);
        Car car6 = new Car("Mazda", "3", "Gray", "KCE345E", 2015, 13000, owner2);
        Car car7 = new Car("Isuzu", "D-Max", "White", "KCF678F", 2020, 18000, owner3);
        repository.saveAll(Arrays.asList(car1, car2, car3, car4, car5, car6, car7));

        // Fetch all cars and log to console
        for (Car car : repository.findAll()) {
            logger.info(car.getBrand() + " " + car.getModel());
        }

        // Username: admin, password: admin
        urepository.save(
            new User(
                "felixmakinda",
                "$2a$12$s2LcHYeHqNuzIZHSxXNLRO4YpLCsC0sbjDQei4onfkpwWbBZbMAZS",
                "ADMIN"
            )
        );

        urepository.save(
            new User(
                "zippygeek1",
                "$2a$12$BPphHG0hwYppNNYcGCQjcO8kB6lRD3fgW8ENh4gn.pxYPqBmKY9VG",
                "USER"
            )
        );

        urepository.save(
            new User(
                "lionelmessi",
                "$2a$12$OKaCZXBdHuYcMdll5QzzbuMYOH3jyHaqCrm6fHiXqHA/wG8tGMqwy",
                "USER"
            )
        );
    }
}
