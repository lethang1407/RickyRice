package org.group5.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "InvoiceDetail")
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id")
    String id;

    @Column(name = "Quantity", nullable = false)
    Long quantity;

    @Column(name = "Discount")
    Integer discount;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "InvoiceID")
    Invoice invoice;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "packageId")
    Package packageType;

    @Column(name = "ProductName", columnDefinition = "NVARCHAR(255)")
    String productName;

    @Column(name = "ProductInformation", columnDefinition = "NVARCHAR(1000)")
    String productInformation;

    @Column(name = "ProductImage")
    String productImage;

    @Column(name = "ProductPrice")
    Double productPrice;

    @Column(name = "ProductCategoryName" , columnDefinition = "NVARCHAR(255)")
    String productCategoryName;

    @Column(name = "ProductCategoryDescription", columnDefinition = "NVARCHAR(1000)")
    String productCategoryDescription;

}
