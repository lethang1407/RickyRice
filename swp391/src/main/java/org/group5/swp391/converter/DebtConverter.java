package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.debt.DebtCreationRequest;
import org.group5.swp391.dto.debt.DebtDTO;
import org.group5.swp391.entity.Debt;
import org.group5.swp391.enums.DebtType;
import org.group5.swp391.enums.Status;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DebtConverter {
    private final ModelMapper modelMapper;

    public Debt toDebtEntity(DebtCreationRequest request){
        Debt debt = new Debt();
        debt.setAmount(request.getAmount());
        debt.setDescription(request.getDescription());
        debt.setImage(request.getImage());
        debt.setStatus(Status.PROCESSING);
        debt.setType(DebtType.valueOf(request.getType()));
        return debt;
    }

    public DebtDTO toDto(Debt debt){
        return modelMapper.map(debt, DebtDTO.class);
    }
}
