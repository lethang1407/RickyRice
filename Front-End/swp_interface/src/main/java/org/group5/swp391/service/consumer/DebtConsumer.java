package org.group5.swp391.service.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.group5.swp391.dto.debt.DebtCreationRequest;
import org.group5.swp391.service.DebtService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DebtConsumer {
    private final DebtService debtService;
    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = "debtQueue")
    public void handleDebt(DebtCreationRequest request) throws JsonProcessingException {
        String debtNumber = debtService.createDebt(request);
        log.info("handle"+ debtNumber + "successfully");
    }
}
