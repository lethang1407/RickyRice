package org.group5.swp391.Service.Impl;

import org.group5.swp391.Converter.ProductConverterTool.ProductConverter;
import org.group5.swp391.DTO.ProductDTOTool.ProductDTO;
import org.group5.swp391.Entity.Product;
import org.group5.swp391.Repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OtherProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductConverter productConverter;

    public Page<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> productDTOS = products.stream().map(productConverter::toProductDTO).collect(Collectors.toList());

        return new PageImpl<>(productDTOS);
    }

    public Page<ProductDTO> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchProducts(query, pageable);
        List<ProductDTO> productPages = products.stream().map(productConverter::toProductDTO).collect(Collectors.toList());
        return new PageImpl<>(productPages, pageable, products.getTotalElements());
    }
}
