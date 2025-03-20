package org.group5.swp391;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class Swp391Application {

    public static void main(String[] args) {
        SpringApplication.run(Swp391Application.class, args);
    }

}
