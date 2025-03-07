package org.group5.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.group5.swp391.enums.DebtType;
import org.group5.swp391.enums.Status;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Debt")
public class Debt extends AbstractEntity {
    @Column(name = "Number")
    String number;

    @Column(name = "Amount", nullable = false)
    Double amount;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    String description;

    @Column(name = "Status", nullable = false)
    @Enumerated(EnumType.STRING)
    Status status;

    @Column(name = "Image")
    String image;

    @Column(name = "Type")
    @Enumerated(EnumType.STRING)
    DebtType type;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "CustomerID")
    Customer customer;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "StoreID")
    Store store;
}
