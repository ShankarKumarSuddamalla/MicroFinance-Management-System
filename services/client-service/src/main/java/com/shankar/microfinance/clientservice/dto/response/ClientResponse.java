package com.shankar.microfinance.clientservice.dto.response;

import com.shankar.microfinance.clientservice.entity.enums.KycStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ClientResponse {

    private String clientNumber;

    private String firstName;

    private String lastName;

    private String mobileNumber;

    private String email;

    private BigDecimal monthlyIncome;

    private KycStatus kycStatus;

    // Generate getters/setters

    public ClientResponse(String clientNumber, String firstName, String lastName, String mobileNumber, String email, BigDecimal monthlyIncome, KycStatus kycStatus) {
        this.clientNumber = clientNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.monthlyIncome = monthlyIncome;
        this.kycStatus = kycStatus;
    }

    public ClientResponse() {
    }

    public String getClientNumber() {
        return clientNumber;
    }

    public void setClientNumber(String clientNumber) {
        this.clientNumber = clientNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public KycStatus getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(KycStatus kycStatus) {
        this.kycStatus = kycStatus;
    }
}