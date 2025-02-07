package org.group5.swp391.Entity;

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
@Table(name = "InvoiceDetail")
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "InvoiceDetailID")
    String invoiceDetailID;

    @Column(name = "Quantity", nullable = false)
    long quantity;

    @Column(name = "Discount")
    int discount;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "InvoiceID")
    Invoice invoice;

    @Column(name = "ProductName")
    String productName;

    @Column(name = "ProductInformation")
    String productInformation;

    @Column(name = "ProductImage")
    String productImage;

    @Column(name = "ProductPrice")
    double productPrice;

    @Column(name = "ProductCategoryName")
    String productCategoryName;

    @Column(name = "ProductCategoryDescription")
    String productCategoryDescription;

}
