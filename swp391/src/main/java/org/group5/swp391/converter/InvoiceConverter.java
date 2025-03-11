package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceDTO;
import org.group5.swp391.dto.store_owner.all_invoice.StoreInvoiceDTO;
import org.group5.swp391.entity.Invoice;
import org.springframework.stereotype.Component;

import java.time.ZoneId;

@Component
@RequiredArgsConstructor
public class InvoiceConverter {

    public StoreInvoiceDTO toStoreInvoiceDTO(Invoice invoice) {
        StoreInvoiceDTO storeInvoiceDTO = new StoreInvoiceDTO();

        storeInvoiceDTO.setInvoiceID(invoice.getId());
        double productMoney = invoice.getProductMoney() != null ? invoice.getProductMoney() : 0.0;
        double shipMoney = invoice.getShipMoney() != null ? invoice.getShipMoney() : 0.0;
        storeInvoiceDTO.setProductMoney(productMoney);
        storeInvoiceDTO.setShipMoney(shipMoney);
        storeInvoiceDTO.setTotalMoney(productMoney + shipMoney);
        storeInvoiceDTO.setDescription(invoice.getDescription());
        storeInvoiceDTO.setType(invoice.getType());
        storeInvoiceDTO.setStatus(invoice.getStatus());
        storeInvoiceDTO.setCustomerName(invoice.getCustomer().getName());
        storeInvoiceDTO.setCustomerPhoneNumber(invoice.getCustomer().getPhoneNumber());
        storeInvoiceDTO.setStoreName(invoice.getStore().getStoreName());

        return storeInvoiceDTO;
    }

    public InvoiceDTO toEmployeeInvoiceDTO(Invoice invoice) {
        InvoiceDTO invoiceDTO = new InvoiceDTO();
        invoiceDTO.setCustomerName(invoice.getCustomer().getName());
        double totalMoney = invoice.getProductMoney() != null ? invoice.getProductMoney() : 0.0;
        double shipMoney = invoice.getShipMoney() != null ? invoice.getShipMoney() : 0.0;
        invoiceDTO.setId(invoice.getId());
        invoiceDTO.setCustomerPhone(invoice.getCustomer().getPhoneNumber());
        invoiceDTO.setTotalAmount(totalMoney);
        invoiceDTO.setTotalShipping(shipMoney);
        invoiceDTO.setType(invoice.getType());
        if(invoice.getCreatedAt() != null) {
            invoiceDTO.setCreated_at(invoice.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        }
        if(invoice.getUpdatedAt() != null) {
            invoiceDTO.setUpdated_at(invoice.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        }
        invoiceDTO.setDescription(invoice.getDescription());
        return invoiceDTO;
    }
}