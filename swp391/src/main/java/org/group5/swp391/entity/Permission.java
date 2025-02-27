package org.group5.swp391.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PermissionID")
    String permissionID;

    @Column(name = "Code", nullable = false, unique = true)
    String code;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    String description;

    @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST} ,mappedBy = "permissions")
    List<Role> roles = new ArrayList<>();
}
