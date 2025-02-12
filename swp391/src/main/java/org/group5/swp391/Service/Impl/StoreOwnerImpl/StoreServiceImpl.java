package org.group5.swp391.Service.Impl.StoreOwnerImpl;

import lombok.RequiredArgsConstructor;
import org.group5.swp391.Converter.StoreOwner.StoreConverter;
import org.group5.swp391.DTO.StoreOwnerDTO.StoreDTO;
import org.group5.swp391.Repository.StoreOwnerRepository.StoreRepository;
import org.group5.swp391.Service.StoreOwnerService.StoreService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final StoreConverter storeConverter;
    @Override
    public Page<StoreDTO> getStores(int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return storeRepository.findAll(pageRequest).map(storeConverter::toStoreDTO);
    }

    @Override
    public Page<StoreDTO> searchStores(String storeName, int page, int size, String sortBy, boolean descending) {
        Sort sort = descending ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return storeRepository.findByStoreNameContainingIgnoreCase(storeName, pageRequest).map(storeConverter::toStoreDTO);
    }
}