package com.smartcomplaint.municipal.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String serviceType;
    private String issueType;

    @Column(columnDefinition = "TEXT")
    private String additionalDesc;

    private String status = "Pending";
    private String reply;

    private Timestamp date = new Timestamp(System.currentTimeMillis());

    // 🆕 Address fields
    private String houseNo;
    private String street;
    private String landmark;
    private String city;
    private String pincode;

    // Getters and Setters

    public Integer getId() { return id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }

    public String getAdditionalDesc() { return additionalDesc; }
    public void setAdditionalDesc(String additionalDesc) { this.additionalDesc = additionalDesc; }

    public Timestamp getDate() { return date; }
    public void setDate(Timestamp date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    // Address fields
    public String getHouseNo() { return houseNo; }
    public void setHouseNo(String houseNo) { this.houseNo = houseNo; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
