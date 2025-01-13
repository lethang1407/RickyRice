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

    @Column(name = "Name")
    String name;

    @Column(name = "Description")
    String description;

    @Column(name = "Price")
    double price;
}
