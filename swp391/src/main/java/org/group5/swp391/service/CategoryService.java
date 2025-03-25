package org.group5.swp391.service;

import org.group5.swp391.dto.customer_requirement.CustomerCategoryDTO;
import org.group5.swp391.dto.employee.EmployeeCategoryDTO;
import org.group5.swp391.dto.employee.EmployeeProductDTO;
import org.group5.swp391.dto.store_owner.all_product.StoreCategoryIdAndNameDTO;
import org.group5.swp391.dto.store_owner.store_detail.StoreDetailCategoryDTO;
import org.group5.swp391.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    public EmployeeCategoryDTO convertToCategoryDTO(Category category);
    public List<EmployeeCategoryDTO> getAllCategories();
    public Page<EmployeeCategoryDTO> getAllCategories(int page, int size, String sortBy, boolean descending);
    public Page<EmployeeCategoryDTO> getCategoryBySearch(String name, int page, int size, String sortBy, boolean descending);
    public List<StoreCategoryIdAndNameDTO> getAllStoreCategories();
    public Page<EmployeeProductDTO> getProductBySearch(String name, int page, int size, String sortBy, boolean descending);
    //Hieu
    public List<CustomerCategoryDTO> getAllCustomerCategories();
    public StoreDetailCategoryDTO getCategoryByID(String categoryID) throws Exception;
    public List<StoreDetailCategoryDTO> getStoreDetailAllCategoriesByStoreID(String storeID);
    public Page<StoreDetailCategoryDTO> getStoreDetailCategory(String search, String storeID,int page, int size, String sortBy, boolean descending);
    public void addCategory(StoreDetailCategoryDTO storeCategoryDTO) throws Exception;
    public void updateCategory(String categoryId, StoreDetailCategoryDTO storeCategoryDTO) throws Exception;
    public void deleteCategory(String categoryId);
}
