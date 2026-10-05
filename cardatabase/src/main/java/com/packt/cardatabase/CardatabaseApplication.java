package com.packt.cardatabase;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.packt.cardatabase.domain.Car;
import com.packt.cardatabase.domain.CarRepository;

@SpringBootApplication
public class CardatabaseApplication implements CommandLineRunner {
	private static final Logger logger = LoggerFactory.getLogger(CardatabaseApplication.class);
	
	@Autowired
	private CarRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(CardatabaseApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		repository.save(new Car("Subaru", "Impreza", "White", "KDH481G", 2014, 12000));
		repository.save(new Car("Toyota", "Corolla", "Silver", "KCA123A", 2018, 15000));
		repository.save(new Car("Nissan", "Almera", "Black", "KCB456B", 2016, 13500));
		repository.save(new Car("Hyundai", "Elantra", "Blue", "KCC789C", 2019, 16000));
		repository.save(new Car("Honda", "Civic", "Red", "KCD012D", 2017, 14500));
		repository.save(new Car("Mazda", "3", "Gray", "KCE345E", 2015, 13000));
		repository.save(new Car("Isuzu", "D-Max", "White", "KCF678F", 2020, 18000));
		
		// Fetch all cars and log to console
		for (Car car : repository.findAll()) {
			logger.info(car.getBrand() + " " + car.getModel());
		}
	}

}
