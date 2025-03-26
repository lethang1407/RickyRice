package org.group5.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Product")
public class Product extends AbstractEntity{
    @Column(name = "Name", nullable = false, columnDefinition = "NVARCHAR(255)")
    String name;

    @Column(name = "Price", nullable = false)
    Double price;

    @Column(name = "Information", columnDefinition = "NVARCHAR(255)")
    String information;

    @Column(name = "ProductImage")
    String productImage;

    @Column(name = "quantity", nullable = false)
    Long quantity;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, fetch = FetchType.LAZY)
    @JoinColumn(name = "StoreID")
    Store store;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID")
    Category category;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch = FetchType.LAZY)
    @JoinTable(
            name="hasAttribute",
            joinColumns = @JoinColumn(name = "ProductID"),
            inverseJoinColumns = @JoinColumn(name = "ProductAttributeID")
    )
    List<ProductAttribute> productAttributes = new ArrayList<>();

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "product")
    List<Zone> zones = new ArrayList<>();
}
