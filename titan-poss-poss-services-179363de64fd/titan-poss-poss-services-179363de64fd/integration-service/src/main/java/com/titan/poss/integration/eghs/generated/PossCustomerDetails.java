
package com.titan.poss.integration.eghs.generated;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for PossCustomerDetails complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PossCustomerDetails"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CustomerID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Prefix" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="honorificID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="City" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CityName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="State" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="StateName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CatchmentArea" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LoyalityID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BirthDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="SpouseBirthday" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="AnniversaryDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="PanCardNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="FormIDProof" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsActive" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="SendSms" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsIDProofSubmitted" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CreatedBy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CreatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="ModifiedBy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ModifiedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="ResidencePhoneNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MobileNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="OfficePhoneNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="PinCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="EmailID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LastModifiedID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LastModifiedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LoginID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ULPMembershipID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Guid" type="{http://microsoft.com/wsdl/types/}guid"/&gt;
 *         &lt;element name="IsULPCustomer" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="TempULPID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsTempULPCustomer" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsAnuttaraCustomer" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsTempAnuttaraCustomer" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="TempLoyaltyID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LoyaltyPoints" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="IsMemberShipIDPopupTobeDispalayed" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsPanCardPopUpToBeDisplayed" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsMinor" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GuardianName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CustomerNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="SpouseName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CustomerBankName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IFSCCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BankAccountNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BranchName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsBankDetailsMandatory" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="BrandName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="isMobileNoDuplicateAtEncircle" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="isMailIdInvalidAtEncircle" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsHardCopySubmitted" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="HardCopySubmittedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="IsULPIssued" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsULPActive" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="TotalCashUnderULPId" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Form60" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PossCustomerDetails", propOrder = {
    "customerID",
    "prefix",
    "honorificID",
    "name",
    "address1",
    "address2",
    "address3",
    "city",
    "cityName",
    "state",
    "stateName",
    "catchmentArea",
    "loyalityID",
    "birthDate",
    "spouseBirthday",
    "anniversaryDate",
    "panCardNo",
    "formIDProof",
    "isActive",
    "sendSms",
    "isIDProofSubmitted",
    "locationCode",
    "createdBy",
    "createdDate",
    "modifiedBy",
    "modifiedDate",
    "residencePhoneNo",
    "mobileNo",
    "officePhoneNo",
    "pinCode",
    "emailID",
    "lastModifiedID",
    "lastModifiedDate",
    "loginID",
    "ulpMembershipID",
    "guid",
    "isULPCustomer",
    "tempULPID",
    "isTempULPCustomer",
    "isAnuttaraCustomer",
    "isTempAnuttaraCustomer",
    "tempLoyaltyID",
    "loyaltyPoints",
    "isMemberShipIDPopupTobeDispalayed",
    "isPanCardPopUpToBeDisplayed",
    "isMinor",
    "guardianName",
    "customerNo",
    "spouseName",
    "customerBankName",
    "ifscCode",
    "bankAccountNumber",
    "branchName",
    "isBankDetailsMandatory",
    "brandName",
    "isMobileNoDuplicateAtEncircle",
    "isMailIdInvalidAtEncircle",
    "isHardCopySubmitted",
    "hardCopySubmittedDate",
    "isULPIssued",
    "isULPActive",
    "totalCashUnderULPId",
    "form60"
})
public class PossCustomerDetails {

    @XmlElement(name = "CustomerID")
    protected int customerID;
    @XmlElement(name = "Prefix")
    protected String prefix;
    protected int honorificID;
    @XmlElement(name = "Name")
    protected String name;
    @XmlElement(name = "Address1")
    protected String address1;
    @XmlElement(name = "Address2")
    protected String address2;
    @XmlElement(name = "Address3")
    protected String address3;
    @XmlElement(name = "City")
    protected int city;
    @XmlElement(name = "CityName")
    protected String cityName;
    @XmlElement(name = "State")
    protected int state;
    @XmlElement(name = "StateName")
    protected String stateName;
    @XmlElement(name = "CatchmentArea")
    protected String catchmentArea;
    @XmlElement(name = "LoyalityID")
    protected String loyalityID;
    @XmlElement(name = "BirthDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar birthDate;
    @XmlElement(name = "SpouseBirthday", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar spouseBirthday;
    @XmlElement(name = "AnniversaryDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar anniversaryDate;
    @XmlElement(name = "PanCardNo")
    protected String panCardNo;
    @XmlElement(name = "FormIDProof")
    protected String formIDProof;
    @XmlElement(name = "IsActive")
    protected boolean isActive;
    @XmlElement(name = "SendSms")
    protected boolean sendSms;
    @XmlElement(name = "IsIDProofSubmitted")
    protected boolean isIDProofSubmitted;
    @XmlElement(name = "LocationCode")
    protected String locationCode;
    @XmlElement(name = "CreatedBy")
    protected String createdBy;
    @XmlElement(name = "CreatedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar createdDate;
    @XmlElement(name = "ModifiedBy")
    protected String modifiedBy;
    @XmlElement(name = "ModifiedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar modifiedDate;
    @XmlElement(name = "ResidencePhoneNo")
    protected String residencePhoneNo;
    @XmlElement(name = "MobileNo")
    protected String mobileNo;
    @XmlElement(name = "OfficePhoneNo")
    protected String officePhoneNo;
    @XmlElement(name = "PinCode")
    protected String pinCode;
    @XmlElement(name = "EmailID")
    protected String emailID;
    @XmlElement(name = "LastModifiedID")
    protected String lastModifiedID;
    @XmlElement(name = "LastModifiedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lastModifiedDate;
    @XmlElement(name = "LoginID")
    protected String loginID;
    @XmlElement(name = "ULPMembershipID")
    protected String ulpMembershipID;
    @XmlElement(name = "Guid", required = true)
    protected String guid;
    @XmlElement(name = "IsULPCustomer")
    protected boolean isULPCustomer;
    @XmlElement(name = "TempULPID")
    protected String tempULPID;
    @XmlElement(name = "IsTempULPCustomer")
    protected boolean isTempULPCustomer;
    @XmlElement(name = "IsAnuttaraCustomer")
    protected boolean isAnuttaraCustomer;
    @XmlElement(name = "IsTempAnuttaraCustomer")
    protected boolean isTempAnuttaraCustomer;
    @XmlElement(name = "TempLoyaltyID")
    protected String tempLoyaltyID;
    @XmlElement(name = "LoyaltyPoints")
    protected int loyaltyPoints;
    @XmlElement(name = "IsMemberShipIDPopupTobeDispalayed")
    protected boolean isMemberShipIDPopupTobeDispalayed;
    @XmlElement(name = "IsPanCardPopUpToBeDisplayed")
    protected boolean isPanCardPopUpToBeDisplayed;
    @XmlElement(name = "IsMinor")
    protected boolean isMinor;
    @XmlElement(name = "GuardianName")
    protected String guardianName;
    @XmlElement(name = "CustomerNo")
    protected int customerNo;
    @XmlElement(name = "SpouseName")
    protected String spouseName;
    @XmlElement(name = "CustomerBankName")
    protected String customerBankName;
    @XmlElement(name = "IFSCCode")
    protected String ifscCode;
    @XmlElement(name = "BankAccountNumber")
    protected String bankAccountNumber;
    @XmlElement(name = "BranchName")
    protected String branchName;
    @XmlElement(name = "IsBankDetailsMandatory")
    protected boolean isBankDetailsMandatory;
    @XmlElement(name = "BrandName")
    protected String brandName;
    protected boolean isMobileNoDuplicateAtEncircle;
    protected boolean isMailIdInvalidAtEncircle;
    @XmlElement(name = "IsHardCopySubmitted")
    protected boolean isHardCopySubmitted;
    @XmlElement(name = "HardCopySubmittedDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar hardCopySubmittedDate;
    @XmlElement(name = "IsULPIssued")
    protected boolean isULPIssued;
    @XmlElement(name = "IsULPActive")
    protected boolean isULPActive;
    @XmlElement(name = "TotalCashUnderULPId")
    protected int totalCashUnderULPId;
    @XmlElement(name = "Form60")
    protected String form60;

    /**
     * Gets the value of the customerID property.
     * 
     */
    public int getCustomerID() {
        return customerID;
    }

    /**
     * Sets the value of the customerID property.
     * 
     */
    public void setCustomerID(int value) {
        this.customerID = value;
    }

    /**
     * Gets the value of the prefix property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPrefix() {
        return prefix;
    }

    /**
     * Sets the value of the prefix property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPrefix(String value) {
        this.prefix = value;
    }

    /**
     * Gets the value of the honorificID property.
     * 
     */
    public int getHonorificID() {
        return honorificID;
    }

    /**
     * Sets the value of the honorificID property.
     * 
     */
    public void setHonorificID(int value) {
        this.honorificID = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the address1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * Sets the value of the address1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddress1(String value) {
        this.address1 = value;
    }

    /**
     * Gets the value of the address2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * Sets the value of the address2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddress2(String value) {
        this.address2 = value;
    }

    /**
     * Gets the value of the address3 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddress3() {
        return address3;
    }

    /**
     * Sets the value of the address3 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddress3(String value) {
        this.address3 = value;
    }

    /**
     * Gets the value of the city property.
     * 
     */
    public int getCity() {
        return city;
    }

    /**
     * Sets the value of the city property.
     * 
     */
    public void setCity(int value) {
        this.city = value;
    }

    /**
     * Gets the value of the cityName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCityName() {
        return cityName;
    }

    /**
     * Sets the value of the cityName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCityName(String value) {
        this.cityName = value;
    }

    /**
     * Gets the value of the state property.
     * 
     */
    public int getState() {
        return state;
    }

    /**
     * Sets the value of the state property.
     * 
     */
    public void setState(int value) {
        this.state = value;
    }

    /**
     * Gets the value of the stateName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStateName() {
        return stateName;
    }

    /**
     * Sets the value of the stateName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStateName(String value) {
        this.stateName = value;
    }

    /**
     * Gets the value of the catchmentArea property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCatchmentArea() {
        return catchmentArea;
    }

    /**
     * Sets the value of the catchmentArea property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCatchmentArea(String value) {
        this.catchmentArea = value;
    }

    /**
     * Gets the value of the loyalityID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLoyalityID() {
        return loyalityID;
    }

    /**
     * Sets the value of the loyalityID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLoyalityID(String value) {
        this.loyalityID = value;
    }

    /**
     * Gets the value of the birthDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getBirthDate() {
        return birthDate;
    }

    /**
     * Sets the value of the birthDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setBirthDate(XMLGregorianCalendar value) {
        this.birthDate = value;
    }

    /**
     * Gets the value of the spouseBirthday property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getSpouseBirthday() {
        return spouseBirthday;
    }

    /**
     * Sets the value of the spouseBirthday property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setSpouseBirthday(XMLGregorianCalendar value) {
        this.spouseBirthday = value;
    }

    /**
     * Gets the value of the anniversaryDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getAnniversaryDate() {
        return anniversaryDate;
    }

    /**
     * Sets the value of the anniversaryDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setAnniversaryDate(XMLGregorianCalendar value) {
        this.anniversaryDate = value;
    }

    /**
     * Gets the value of the panCardNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPanCardNo() {
        return panCardNo;
    }

    /**
     * Sets the value of the panCardNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPanCardNo(String value) {
        this.panCardNo = value;
    }

    /**
     * Gets the value of the formIDProof property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFormIDProof() {
        return formIDProof;
    }

    /**
     * Sets the value of the formIDProof property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFormIDProof(String value) {
        this.formIDProof = value;
    }

    /**
     * Gets the value of the isActive property.
     * 
     */
    public boolean isIsActive() {
        return isActive;
    }

    /**
     * Sets the value of the isActive property.
     * 
     */
    public void setIsActive(boolean value) {
        this.isActive = value;
    }

    /**
     * Gets the value of the sendSms property.
     * 
     */
    public boolean isSendSms() {
        return sendSms;
    }

    /**
     * Sets the value of the sendSms property.
     * 
     */
    public void setSendSms(boolean value) {
        this.sendSms = value;
    }

    /**
     * Gets the value of the isIDProofSubmitted property.
     * 
     */
    public boolean isIsIDProofSubmitted() {
        return isIDProofSubmitted;
    }

    /**
     * Sets the value of the isIDProofSubmitted property.
     * 
     */
    public void setIsIDProofSubmitted(boolean value) {
        this.isIDProofSubmitted = value;
    }

    /**
     * Gets the value of the locationCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLocationCode() {
        return locationCode;
    }

    /**
     * Sets the value of the locationCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLocationCode(String value) {
        this.locationCode = value;
    }

    /**
     * Gets the value of the createdBy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * Sets the value of the createdBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCreatedBy(String value) {
        this.createdBy = value;
    }

    /**
     * Gets the value of the createdDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getCreatedDate() {
        return createdDate;
    }

    /**
     * Sets the value of the createdDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setCreatedDate(XMLGregorianCalendar value) {
        this.createdDate = value;
    }

    /**
     * Gets the value of the modifiedBy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getModifiedBy() {
        return modifiedBy;
    }

    /**
     * Sets the value of the modifiedBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setModifiedBy(String value) {
        this.modifiedBy = value;
    }

    /**
     * Gets the value of the modifiedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getModifiedDate() {
        return modifiedDate;
    }

    /**
     * Sets the value of the modifiedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setModifiedDate(XMLGregorianCalendar value) {
        this.modifiedDate = value;
    }

    /**
     * Gets the value of the residencePhoneNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getResidencePhoneNo() {
        return residencePhoneNo;
    }

    /**
     * Sets the value of the residencePhoneNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setResidencePhoneNo(String value) {
        this.residencePhoneNo = value;
    }

    /**
     * Gets the value of the mobileNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMobileNo() {
        return mobileNo;
    }

    /**
     * Sets the value of the mobileNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMobileNo(String value) {
        this.mobileNo = value;
    }

    /**
     * Gets the value of the officePhoneNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOfficePhoneNo() {
        return officePhoneNo;
    }

    /**
     * Sets the value of the officePhoneNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOfficePhoneNo(String value) {
        this.officePhoneNo = value;
    }

    /**
     * Gets the value of the pinCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPinCode() {
        return pinCode;
    }

    /**
     * Sets the value of the pinCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPinCode(String value) {
        this.pinCode = value;
    }

    /**
     * Gets the value of the emailID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEmailID() {
        return emailID;
    }

    /**
     * Sets the value of the emailID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEmailID(String value) {
        this.emailID = value;
    }

    /**
     * Gets the value of the lastModifiedID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLastModifiedID() {
        return lastModifiedID;
    }

    /**
     * Sets the value of the lastModifiedID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLastModifiedID(String value) {
        this.lastModifiedID = value;
    }

    /**
     * Gets the value of the lastModifiedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getLastModifiedDate() {
        return lastModifiedDate;
    }

    /**
     * Sets the value of the lastModifiedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setLastModifiedDate(XMLGregorianCalendar value) {
        this.lastModifiedDate = value;
    }

    /**
     * Gets the value of the loginID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLoginID() {
        return loginID;
    }

    /**
     * Sets the value of the loginID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLoginID(String value) {
        this.loginID = value;
    }

    /**
     * Gets the value of the ulpMembershipID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getULPMembershipID() {
        return ulpMembershipID;
    }

    /**
     * Sets the value of the ulpMembershipID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setULPMembershipID(String value) {
        this.ulpMembershipID = value;
    }

    /**
     * Gets the value of the guid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGuid() {
        return guid;
    }

    /**
     * Sets the value of the guid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGuid(String value) {
        this.guid = value;
    }

    /**
     * Gets the value of the isULPCustomer property.
     * 
     */
    public boolean isIsULPCustomer() {
        return isULPCustomer;
    }

    /**
     * Sets the value of the isULPCustomer property.
     * 
     */
    public void setIsULPCustomer(boolean value) {
        this.isULPCustomer = value;
    }

    /**
     * Gets the value of the tempULPID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTempULPID() {
        return tempULPID;
    }

    /**
     * Sets the value of the tempULPID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTempULPID(String value) {
        this.tempULPID = value;
    }

    /**
     * Gets the value of the isTempULPCustomer property.
     * 
     */
    public boolean isIsTempULPCustomer() {
        return isTempULPCustomer;
    }

    /**
     * Sets the value of the isTempULPCustomer property.
     * 
     */
    public void setIsTempULPCustomer(boolean value) {
        this.isTempULPCustomer = value;
    }

    /**
     * Gets the value of the isAnuttaraCustomer property.
     * 
     */
    public boolean isIsAnuttaraCustomer() {
        return isAnuttaraCustomer;
    }

    /**
     * Sets the value of the isAnuttaraCustomer property.
     * 
     */
    public void setIsAnuttaraCustomer(boolean value) {
        this.isAnuttaraCustomer = value;
    }

    /**
     * Gets the value of the isTempAnuttaraCustomer property.
     * 
     */
    public boolean isIsTempAnuttaraCustomer() {
        return isTempAnuttaraCustomer;
    }

    /**
     * Sets the value of the isTempAnuttaraCustomer property.
     * 
     */
    public void setIsTempAnuttaraCustomer(boolean value) {
        this.isTempAnuttaraCustomer = value;
    }

    /**
     * Gets the value of the tempLoyaltyID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTempLoyaltyID() {
        return tempLoyaltyID;
    }

    /**
     * Sets the value of the tempLoyaltyID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTempLoyaltyID(String value) {
        this.tempLoyaltyID = value;
    }

    /**
     * Gets the value of the loyaltyPoints property.
     * 
     */
    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    /**
     * Sets the value of the loyaltyPoints property.
     * 
     */
    public void setLoyaltyPoints(int value) {
        this.loyaltyPoints = value;
    }

    /**
     * Gets the value of the isMemberShipIDPopupTobeDispalayed property.
     * 
     */
    public boolean isIsMemberShipIDPopupTobeDispalayed() {
        return isMemberShipIDPopupTobeDispalayed;
    }

    /**
     * Sets the value of the isMemberShipIDPopupTobeDispalayed property.
     * 
     */
    public void setIsMemberShipIDPopupTobeDispalayed(boolean value) {
        this.isMemberShipIDPopupTobeDispalayed = value;
    }

    /**
     * Gets the value of the isPanCardPopUpToBeDisplayed property.
     * 
     */
    public boolean isIsPanCardPopUpToBeDisplayed() {
        return isPanCardPopUpToBeDisplayed;
    }

    /**
     * Sets the value of the isPanCardPopUpToBeDisplayed property.
     * 
     */
    public void setIsPanCardPopUpToBeDisplayed(boolean value) {
        this.isPanCardPopUpToBeDisplayed = value;
    }

    /**
     * Gets the value of the isMinor property.
     * 
     */
    public boolean isIsMinor() {
        return isMinor;
    }

    /**
     * Sets the value of the isMinor property.
     * 
     */
    public void setIsMinor(boolean value) {
        this.isMinor = value;
    }

    /**
     * Gets the value of the guardianName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGuardianName() {
        return guardianName;
    }

    /**
     * Sets the value of the guardianName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGuardianName(String value) {
        this.guardianName = value;
    }

    /**
     * Gets the value of the customerNo property.
     * 
     */
    public int getCustomerNo() {
        return customerNo;
    }

    /**
     * Sets the value of the customerNo property.
     * 
     */
    public void setCustomerNo(int value) {
        this.customerNo = value;
    }

    /**
     * Gets the value of the spouseName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSpouseName() {
        return spouseName;
    }

    /**
     * Sets the value of the spouseName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSpouseName(String value) {
        this.spouseName = value;
    }

    /**
     * Gets the value of the customerBankName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerBankName() {
        return customerBankName;
    }

    /**
     * Sets the value of the customerBankName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerBankName(String value) {
        this.customerBankName = value;
    }

    /**
     * Gets the value of the ifscCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIFSCCode() {
        return ifscCode;
    }

    /**
     * Sets the value of the ifscCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIFSCCode(String value) {
        this.ifscCode = value;
    }

    /**
     * Gets the value of the bankAccountNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    /**
     * Sets the value of the bankAccountNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBankAccountNumber(String value) {
        this.bankAccountNumber = value;
    }

    /**
     * Gets the value of the branchName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBranchName() {
        return branchName;
    }

    /**
     * Sets the value of the branchName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBranchName(String value) {
        this.branchName = value;
    }

    /**
     * Gets the value of the isBankDetailsMandatory property.
     * 
     */
    public boolean isIsBankDetailsMandatory() {
        return isBankDetailsMandatory;
    }

    /**
     * Sets the value of the isBankDetailsMandatory property.
     * 
     */
    public void setIsBankDetailsMandatory(boolean value) {
        this.isBankDetailsMandatory = value;
    }

    /**
     * Gets the value of the brandName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBrandName() {
        return brandName;
    }

    /**
     * Sets the value of the brandName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBrandName(String value) {
        this.brandName = value;
    }

    /**
     * Gets the value of the isMobileNoDuplicateAtEncircle property.
     * 
     */
    public boolean isIsMobileNoDuplicateAtEncircle() {
        return isMobileNoDuplicateAtEncircle;
    }

    /**
     * Sets the value of the isMobileNoDuplicateAtEncircle property.
     * 
     */
    public void setIsMobileNoDuplicateAtEncircle(boolean value) {
        this.isMobileNoDuplicateAtEncircle = value;
    }

    /**
     * Gets the value of the isMailIdInvalidAtEncircle property.
     * 
     */
    public boolean isIsMailIdInvalidAtEncircle() {
        return isMailIdInvalidAtEncircle;
    }

    /**
     * Sets the value of the isMailIdInvalidAtEncircle property.
     * 
     */
    public void setIsMailIdInvalidAtEncircle(boolean value) {
        this.isMailIdInvalidAtEncircle = value;
    }

    /**
     * Gets the value of the isHardCopySubmitted property.
     * 
     */
    public boolean isIsHardCopySubmitted() {
        return isHardCopySubmitted;
    }

    /**
     * Sets the value of the isHardCopySubmitted property.
     * 
     */
    public void setIsHardCopySubmitted(boolean value) {
        this.isHardCopySubmitted = value;
    }

    /**
     * Gets the value of the hardCopySubmittedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getHardCopySubmittedDate() {
        return hardCopySubmittedDate;
    }

    /**
     * Sets the value of the hardCopySubmittedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setHardCopySubmittedDate(XMLGregorianCalendar value) {
        this.hardCopySubmittedDate = value;
    }

    /**
     * Gets the value of the isULPIssued property.
     * 
     */
    public boolean isIsULPIssued() {
        return isULPIssued;
    }

    /**
     * Sets the value of the isULPIssued property.
     * 
     */
    public void setIsULPIssued(boolean value) {
        this.isULPIssued = value;
    }

    /**
     * Gets the value of the isULPActive property.
     * 
     */
    public boolean isIsULPActive() {
        return isULPActive;
    }

    /**
     * Sets the value of the isULPActive property.
     * 
     */
    public void setIsULPActive(boolean value) {
        this.isULPActive = value;
    }

    /**
     * Gets the value of the totalCashUnderULPId property.
     * 
     */
    public int getTotalCashUnderULPId() {
        return totalCashUnderULPId;
    }

    /**
     * Sets the value of the totalCashUnderULPId property.
     * 
     */
    public void setTotalCashUnderULPId(int value) {
        this.totalCashUnderULPId = value;
    }

    /**
     * Gets the value of the form60 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getForm60() {
        return form60;
    }

    /**
     * Sets the value of the form60 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setForm60(String value) {
        this.form60 = value;
    }

}
