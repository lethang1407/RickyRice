package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "NotificationID")
    String notificationID;

    @Column(name = "Message", nullable = false, columnDefinition = "NVARCHAR(255)")
    String message;

    @Column(name = "SendAt", nullable = false)
    LocalDateTime sendAt;

    @Column(name = "IsRead")
    Boolean isRead;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "AccountID")
    Account sendAccount;

    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinColumn(name = "targetAccountID")
    Account targetAccount;
}
