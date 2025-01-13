package org.group5.swp391.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
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

    @Column(name = "Description")
    String description;

    @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST} ,mappedBy = "permissions")
    Set<Role> roles = new HashSet<>();
}
