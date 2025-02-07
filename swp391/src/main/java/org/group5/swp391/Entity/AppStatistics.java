package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "AppStatistics")
public class AppStatistics extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AppStatisticsID")
    String appStatisticsID;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "StoreID")
    Store store;

    @Column(name = "SubcriptionPlanName")
    String subcriptionPlanName;

    @Column(name = "SubcriptionPlanPrice")
    double subcriptionPlanPrice;

    @Column(name = "SubcriptionDescription")
    String subcriptionDescription;

    @Column(name = "SubcriptionTimeOfExpiration")
    Integer subcriptionTimeOfExpiration;

}
