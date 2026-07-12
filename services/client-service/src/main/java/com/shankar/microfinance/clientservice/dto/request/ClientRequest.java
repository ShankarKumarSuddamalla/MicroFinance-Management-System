package com.shankar.microfinance.clientservice.dto.request;

import com.shankar.microfinance.clientservice.entity.enums.Gender;
import com.shankar.microfinance.clientservice.entity.enums.MaritalStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter
@Setter
public class ClientRequest {

    @NotBlank
    private String firstName;

    private String lastName;

    @NotNull
    private Gender gender;

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String mobileNumber;

    @Email
    private String email;

    @NotBlank
    private String aadhaarNumber;

    @NotBlank
    private String panNumber;

    private String occupation;

    private BigDecimal monthlyIncome;

    private MaritalStatus maritalStatus;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String postalCode;

    private String country;

    // Generate getters/setters

    public @NotBlank String getFirstName() {
        return firstName;
    }

    public void setFirstName(@NotBlank String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public @NotNull Gender getGender() {
        return gender;
    }

    public void setGender(@NotNull Gender gender) {
        this.gender = gender;
    }

    public @NotNull LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(@NotNull LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public @NotBlank String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(@NotBlank String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public @Email String getEmail() {
        return email;
    }

    public void setEmail(@Email String email) {
        this.email = email;
    }

    public @NotBlank String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(@NotBlank String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public @NotBlank String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(@NotBlank String panNumber) {
        this.panNumber = panNumber;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public ClientRequest(String firstName, String lastName, Gender gender, LocalDate dateOfBirth, String mobileNumber, String email, String aadhaarNumber, String panNumber, String occupation, BigDecimal monthlyIncome, MaritalStatus maritalStatus, String addressLine1, String addressLine2, String city, String state, String postalCode, String country) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.aadhaarNumber = aadhaarNumber;
        this.panNumber = panNumber;
        this.occupation = occupation;
        this.monthlyIncome = monthlyIncome;
        this.maritalStatus = maritalStatus;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
    }

    public ClientRequest() {
    }
}