package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AccountID")
    String accountID;

    @Column(name = "Username", unique = true, nullable = false)
    String username;

    @Column(name = "Password", nullable = false)
    String password;

    @Column(name = "Email", unique = true)
    String email;

    @Column(name = "PhoneNumber", unique = true, nullable = false)
    String phoneNumber;

    @Column(name = "Avatar")
    String avatar;

    @Column(name = "CreatedAt")
    LocalDateTime createdAt;

    @Column(name = "IsActive")
    Boolean isActive;

    @OneToMany(mappedBy = "targetAccount",cascade = { CascadeType.PERSIST, CascadeType.MERGE})
    List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "sendAccount",cascade = { CascadeType.PERSIST, CascadeType.MERGE})
    List<Notification> sentNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "storeAccount",cascade = { CascadeType.PERSIST, CascadeType.MERGE})
    List<Store> stores = new ArrayList<>();

    @OneToOne(mappedBy = "employeeAccount")
    Employee employee;
}
