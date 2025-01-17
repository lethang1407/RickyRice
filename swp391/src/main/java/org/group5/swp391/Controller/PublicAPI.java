package org.group5.swp391.Controller;

import org.group5.swp391.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicAPI {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping(value = "/category")
    public void getCategory() {
        categoryRepository.findAll()
                .forEach((item) -> System.out.println(item.getName()));
    }
}
