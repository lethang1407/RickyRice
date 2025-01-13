package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Debt")
public class Debt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DebtID")
    String debtID;

    @Column(name = "Amount", nullable = false)
    double amount;

    @Column(name = "Description")
    String description;

    @Column(name = "Date", nullable = false)
    LocalDate date;

    @Column(name = "Status", nullable = false)
    String status;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "CustomerID")
    Customer customer;
}
