package com.smartcomplaint.municipal.dto;

import lombok.Data;

@Data
public class ComplaintRequestDTO {
    private String username;
    private String serviceType;
    private String issueType;
    private String description;
    private AddressDTO address;

    @Data
    public static class AddressDTO {
        private String houseNo;
        private String street;
        private String landmark;
        private String city;
        private String pincode;
    }
}
