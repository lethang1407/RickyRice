package hsf302.se1889.he187250.controller;

import hsf302.se1889.he187250.dto.CustomerDTO;
import hsf302.se1889.he187250.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/customers")
    public String getAllCustomers(Model model) {
        List<CustomerDTO> customers = customerService.getAllCustomers();
        model.addAttribute("customers", customers);
        return "customer-list";
    }
}