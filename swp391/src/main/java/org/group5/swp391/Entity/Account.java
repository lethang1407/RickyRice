package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Account")
public class Account extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AccountID")
    String accountID;

    @Column(name = "Username", unique = true, nullable = false)
    String username;

    @Column(name = "name" ,columnDefinition = "NVARCHAR(255)")
    String name;

    @Column(name = "Password", nullable = false)
    String password;

    @Column(name = "Email", unique = true)
    String email;

    @Column(name = "PhoneNumber", unique = true, nullable = false)
    String phoneNumber;

    @Column(name = "Avatar", columnDefinition = "NVARCHAR(255)")
    String avatar;

    @Column(name = "IsActive")
    Boolean isActive;

    @Column(name = "Gender")
    Boolean gender;

    @Column(name = "BirthDate")
    LocalDate birthDate;

    @Column(name = "OTP", length = 6)
    String otp;

    @OneToMany(mappedBy = "targetAccount",cascade = { CascadeType.PERSIST, CascadeType.MERGE},fetch = FetchType.LAZY)
    List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "sendAccount",cascade = { CascadeType.PERSIST, CascadeType.MERGE},fetch = FetchType.LAZY)
    List<Notification> sentNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "storeAccount",cascade = { CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    List<Store> stores = new ArrayList<>();

    @OneToOne(mappedBy = "employeeAccount", fetch = FetchType.LAZY)
    Employee employee;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "RoleID")
    Role role;
}
