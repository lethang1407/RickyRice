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
@Table(name = "AppStatistics")
public class AppStatistics extends AbstractEntity {
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "StoreID")
    Store store;

    @Column(name = "SubcriptionPlanName")
    String subcriptionPlanName;

    @Column(name = "SubcriptionPlanPrice")
    Double subcriptionPlanPrice;

    @Column(name = "SubcriptionDescription", columnDefinition = "NVARCHAR(255)")
    String subcriptionDescription;

    @Column(name = "SubcriptionTimeOfExpiration")
    Integer subcriptionTimeOfExpiration;

    @Column(name = "TransactionNo")
    String transactionNo;
}
