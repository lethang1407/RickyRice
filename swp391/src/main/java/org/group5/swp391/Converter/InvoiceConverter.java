package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreInvoiceDTO;
import org.group5.swp391.Entity.Invoice;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceConverter {

    public StoreInvoiceDTO toStoreInvoiceDTO(Invoice invoice) {
        StoreInvoiceDTO storeInvoiceDTO = new StoreInvoiceDTO();

        storeInvoiceDTO.setInvoiceID(invoice.getInvoiceID());
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
}