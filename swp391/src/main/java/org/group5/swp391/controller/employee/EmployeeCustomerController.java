package org.group5.swp391.controller.employee;

import jakarta.validation.Valid;
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
        System.out.println(phonesearch);
        return customerService.EmployeeGetAllCustomer(page, size, sortBy, sortOrder,phonesearch);
    }
    @GetMapping("/customersList")
    public List<EmployeeCustomerDTO> getAllCustomersInList(@RequestParam(value = "phonesearch", required = false, defaultValue = "") String phonesearch )
    {
        return customerService.EmployeeGetAllCustomerInList(phonesearch);
    }

    @PutMapping("/customers/edit/{customerId}")
    public ResponseEntity<?> updateCustomer(
            @Valid
            @PathVariable String customerId,
            @RequestBody Customer customerDetails  )
    {
            Customer updatedCustomer = customerService.updateCustomer(customerId, customerDetails);
            return ResponseEntity.ok(updatedCustomer);
    }
    @PutMapping("/customers/editInvoice/{phoneNumber}")
    public ResponseEntity<?> updateCustomerInvoice(@Valid
            @PathVariable String phoneNumber,
            @RequestBody CustomerUpdateRequest customerDetails)
    {
            Customer updatedCustomer = customerService.InvoiceUpdateCustomer(phoneNumber, customerDetails);
            return ResponseEntity.ok(updatedCustomer);
    }


    @PostMapping("/customers/create")
    public ResponseEntity<?> createCustomer(@Valid @RequestBody EmployeeCustomerDTO customerDTO) {
            customerService.createCustomer(customerDTO);
            return ResponseEntity.ok("tạo khách hàng thành công ");
    }
}
