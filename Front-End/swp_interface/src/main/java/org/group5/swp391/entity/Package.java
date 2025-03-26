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
public class Package extends AbstractEntity{
    @Column(name = "description")
    String description;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "StoreID")
    Store store;

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "packageType")
    List<InvoiceDetail> invoiceDetailList = new ArrayList<>();
}
