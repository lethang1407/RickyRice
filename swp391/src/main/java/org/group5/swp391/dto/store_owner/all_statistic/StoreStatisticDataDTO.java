package org.group5.swp391.dto.store_owner.all_statistic;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreStatisticDataDTO {
    int totalEmployees;
    int totalProducts;
    int totalTransactions;
    double totalExport;
    double totalImport;
    double totalDebtOfKH;
    double totalDebtOfCH;
}