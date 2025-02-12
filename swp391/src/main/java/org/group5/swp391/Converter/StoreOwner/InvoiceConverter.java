package org.group5.swp391.Converter.StoreOwner;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.StoreOwnerDTO.InvoiceDTO;
import org.group5.swp391.Entity.Invoice;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceConverter {

    public InvoiceDTO toInvoiceDTO(Invoice invoice) {
        InvoiceDTO invoiceDTO = new InvoiceDTO();

        invoiceDTO.setInvoiceID(invoice.getInvoiceID());
        double productMoney = invoice.getProductMoney() != null ? invoice.getProductMoney() : 0.0;
        double shipMoney = invoice.getShipMoney() != null ? invoice.getShipMoney() : 0.0;
        invoiceDTO.setProductMoney(productMoney);
        invoiceDTO.setShipMoney(shipMoney);
        invoiceDTO.setTotalMoney(productMoney + shipMoney);
        invoiceDTO.setDescription(invoice.getDescription());
        invoiceDTO.setType(invoice.getType());
        invoiceDTO.setStatus(invoice.getStatus());

        invoiceDTO.setCustomerName(invoice.getCustomer().getName());
        invoiceDTO.setCustomerPhoneNumber(invoice.getCustomer().getPhoneNumber());
        invoiceDTO.setStoreName(invoice.getStore().getStoreName());

        return invoiceDTO;
    }
}