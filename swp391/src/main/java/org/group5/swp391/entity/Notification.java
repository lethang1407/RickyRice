package org.group5.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Notification")
public class Notification extends AbstractEntity {
    @Column(name = "Message", nullable = false, columnDefinition = "NVARCHAR(255)")
    String message;

    @Column(name = "IsRead")
    Boolean isRead;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "AccountID")
    Account sendAccount;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "targetAccountID")
    Account targetAccount;
}
