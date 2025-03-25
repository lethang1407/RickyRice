package org.group5.swp391.converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.dto.request.authentication_request.AccountCreationRequest;
import org.group5.swp391.entity.Account;
import org.group5.swp391.entity.Role;
import org.group5.swp391.exception.AppException;
import org.group5.swp391.exception.ErrorCode;
import org.group5.swp391.repository.RoleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AccountConverter {
    private final ModelMapper modelMapper;
    private final RoleRepository roleRepository;

    public Account toAccountEntity(AccountCreationRequest request){
        Account acc = modelMapper.map(request, Account.class);
        acc.setAvatar(request.getAvatar());
        if(request.getGender()!=null){
            switch (request.getGender()){
                case 0:
                    acc.setGender(true);
                    break;
                case 1:
                    acc.setGender(false);
                    break;
                default:
                    acc.setGender(null);
            }
        }
        Role role = roleRepository.findByCode(request.getRole()).orElseThrow(()-> new AppException(ErrorCode.NOT_FOUND));
        acc.setRole(role);
        acc.setIsActive(true);
        return acc;
    }
}
