package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "StoreStatistics")
public class Statistics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "StatisticsID")
    String statisticsID;

    @Column(name = "Date")
    LocalDateTime date;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    String description;

    @Column(name = "Type")
    Boolean type;

    @Column(name = "TotalMoney")
    Double totalMoney;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "StoreID")
    Store store;
}
