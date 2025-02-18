package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "SubscriptionPlan")
public class SubscriptionPlan extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SubscriptionPlanID")
    String subscriptionPlanID;

    @Column(name = "Name", columnDefinition = "NVARCHAR(255)")
    String name;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    String description;

    @Column(name = "Price")
    Double price;

    @Column(name = "TimeOfExpiration")
    Integer timeOfExpiration;
}
