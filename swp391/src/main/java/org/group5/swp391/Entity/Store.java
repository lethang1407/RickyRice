package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Store")
public class Store extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "StoreID")
    String storeID;

    @Column(name = "StoreName", nullable = false, columnDefinition = "NVARCHAR(255)")
    String storeName;

    @Column(name = "Address", nullable = false, columnDefinition = "NVARCHAR(255)")
    String address;

    @Column(name = "Hotline", nullable = false)
    String hotline;

    @Column(name = "Description", nullable = false, columnDefinition = "NVARCHAR(255)")
    String description;

    @Column(name = "OperatingHour", nullable = false)
    String operatingHour;

    @Column(name = "ExpireAt")
    LocalDateTime expireAt;

    @Column(name = "Image", nullable = false)
    String image;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountID")
    Account storeAccount;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "SubscriptionPlanID")
    SubscriptionPlan subscriptionPlan;

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "store")
    List<Statistics> statisticsList = new ArrayList<>();

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "store")
    List<Employee> employees = new ArrayList<>();

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "store")
    List<Customer> customers = new ArrayList<>();

    @OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "store")
    List<Product> products = new ArrayList<>();
}
