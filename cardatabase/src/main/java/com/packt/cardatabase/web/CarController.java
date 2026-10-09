package com.packt.cardatabase.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.packt.cardatabase.domain.Car;
import com.packt.cardatabase.domain.CarRepository;;

@RestController
public class CarController {
    @Autowired
    private CarRepository repository;

    @RequestMapping("/cars")
    public Iterable<Car> getCars() {
        // Fetch and return cars
        return repository.findAll();
    }

}
