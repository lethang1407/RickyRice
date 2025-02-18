package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Product")
public class Product extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ProductID")
    String productID;

    @Column(name = "Name", nullable = false, columnDefinition = "NVARCHAR(255)")
    String name;

    @Column(name = "Price", nullable = false)
    Double price;

    @Column(name = "Information", columnDefinition = "NVARCHAR(255)")
    String information;

    @Column(name = "ProductImage", nullable = false)
    String productImage;

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
