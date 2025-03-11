package org.group5.swp391.controller.employee;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.CustomerUpdateRequest;
import org.group5.swp391.dto.employee.EmployeeCustomerDTO;
import org.group5.swp391.entity.Customer;
import org.group5.swp391.service.impl.CustomerServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeCustomerController {
    private final CustomerServiceImpl customerService;

    @GetMapping("/customers")
    public Page<EmployeeCustomerDTO> getAllCustomers(@RequestParam("page") int page,
                                                     @RequestParam("size") int size,
                                                     @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt")String sortBy,
                                                     @RequestParam(value = "sortOrder", required = false, defaultValue = "false")boolean sortOrder,
                                                     @RequestParam(value = "phonesearch", required = false, defaultValue = "") String phonesearch )
    {
        return customerService.EmployeeGetAllCustomer(page, size, sortBy, sortOrder,phonesearch);
    }
    @GetMapping("/customersList")
    public List<EmployeeCustomerDTO> getAllCustomersInList(@RequestParam(value = "phonesearch", required = false, defaultValue = "") String phonesearch )
    {
        return customerService.EmployeeGetAllCustomerInList(phonesearch);
    }

    @PutMapping("/customers/edit/{customerId}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable String customerId,
            @RequestBody Customer customerDetails  )
    {
        try {
            Customer updatedCustomer = customerService.updateCustomer(customerId, customerDetails);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
    @PutMapping("/customers/editInvoice/{phoneNumber}")
    public ResponseEntity<?> updateCustomerInvoice(
            @PathVariable String phoneNumber,
            @RequestBody CustomerUpdateRequest customerDetails)
    {
        try {
            Customer updatedCustomer = customerService.InvoiceUpdateCustomer(phoneNumber, customerDetails);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    @PostMapping("/customers/create")
    public ResponseEntity<?> createCustomer(@RequestBody EmployeeCustomerDTO customerDTO) {
        try {
            Customer savedCustomer = customerService.createCustomer(customerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi khi tạo khách hàng: " + e.getMessage());
        }
    }
}
