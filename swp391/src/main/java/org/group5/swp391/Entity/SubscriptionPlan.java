package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "SubscriptionPlan")
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SubscriptionPlanID")
    String subscriptionPlanID;

    @Column(name = "Name", columnDefinition = "NVARCHAR(255)")
    String name;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    String description;

    @Column(name = "Price")
    double price;

    @Column(name = "TimeOfExpiration")
    int timeOfExpiration;
}
