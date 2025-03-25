package org.group5.swp391.service.consumer;
import lombok.RequiredArgsConstructor;
import org.group5.swp391.config.RabbitMqConfig;
import org.group5.swp391.dto.employee.InvoiceRequest.InvoiceRequest;
import org.group5.swp391.service.impl.InvoiceServiceImpl;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceConsumer {
    private final InvoiceServiceImpl invoiceService;

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME2)
    public void processInvoice(InvoiceRequest invoiceRequest) {
        try{
            invoiceService.CreateInvoice(invoiceRequest);
            System.out.println("Đã xử lý hóa đơn cho khách: " + invoiceRequest.getInvoice().getCustomerName());
        }catch (Exception e){
            System.err.println("Lỗi khi xử lý hóa đơn: " + e.getMessage());
        }

    }


}
