package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "ProductAttribute")
public class ProductAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ProductAttributeID")
    String productAttributeID;

    @Column(name = "value", columnDefinition = "NVARCHAR(255)")
    String value;

    @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST} ,mappedBy = "productAttributes")
    Set<Product> products = new HashSet<>();

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "StoreID")
    Store store;
}
