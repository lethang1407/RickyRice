package org.group5.swp391.dto.employee;

public class CustomerUpdateRequest {
    private String phoneNumber;
    private String phoneNumberNew;
    private String name;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumberNew() {
        return phoneNumberNew;
    }

    public void setPhoneNumberNew(String phoneNumberNew) {
        this.phoneNumberNew = phoneNumberNew;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
