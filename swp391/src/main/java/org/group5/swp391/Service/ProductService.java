package org.group5.swp391.Service;

import org.group5.swp391.Converter.ProductConverterTool.ProductConverter;
import org.group5.swp391.DTO.ProductDTOTool.ProductDTO;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductConverter productConverter;

    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();

        List<ProductDTO> productDTOS = products.stream().map(productConverter::toProductDTO).collect(Collectors.toList());

        return productDTOS;
    }
}
