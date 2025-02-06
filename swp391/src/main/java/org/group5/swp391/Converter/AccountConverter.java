package org.group5.swp391.Converter;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.DTO.Request.AuthenticationRequest.AccountCreationRequest;
import org.group5.swp391.Entity.Account;
import org.group5.swp391.Entity.Role;
import org.group5.swp391.Exception.AppException;
import org.group5.swp391.Exception.ErrorCode;
import org.group5.swp391.Repository.RoleRepository;
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
