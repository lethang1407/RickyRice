package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CustomerID")
    String customerID;

    @Column(name = "Name", nullable = false)
    String name;

    @Column(name = "PhoneNumber", unique = true)
    String phoneNumber;

    @Column(name = "Address")
    String address;

    @Column(name = "Email", unique = true)
    String email;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "StoreID")
    Store store;

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "customer")
    List<Debt> debts = new ArrayList<>();

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "customer")
    List<Invoice> invoices = new ArrayList<>();
}
