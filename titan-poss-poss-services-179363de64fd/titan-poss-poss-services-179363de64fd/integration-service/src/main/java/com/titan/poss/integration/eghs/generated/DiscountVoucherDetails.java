
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for DiscountVoucherDetails complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DiscountVoucherDetails"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="GHSAccountNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="TotalInstallmentAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="GHSVoucherDiscount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="VoucherNo" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="IsAllowedGoldCoin" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="ValidFrom" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="ValidTill" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="VoucherStatus" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RedeemedCMNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="RedeemedLocation" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="RedemptionDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="CreatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LastModifiedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LoginID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LastModifiedID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="SuccessMessage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ErrorMessage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MobileNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CustomerID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CustomerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="SchemeCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NoOfInstallmentsPayed" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ULPMembershipID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="PinCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Address3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TownName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="StateName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MailID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="RefundedDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="AccountOpenedDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="VoucherValidTill" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="VoucherValidTillExpiryDays" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ApprovedBy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ApprovalMailDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DiscountVoucherDetails", propOrder = {
    "ghsAccountNo",
    "totalInstallmentAmount",
    "ghsVoucherDiscount",
    "voucherNo",
    "isAllowedGoldCoin",
    "validFrom",
    "validTill",
    "status",
    "voucherStatus",
    "redeemedCMNo",
    "redeemedLocation",
    "redemptionDate",
    "createdDate",
    "lastModifiedDate",
    "loginID",
    "lastModifiedID",
    "successMessage",
    "errorMessage",
    "mobileNo",
    "customerID",
    "customerName",
    "locationCode",
    "schemeCode",
    "noOfInstallmentsPayed",
    "title",
    "ulpMembershipID",
    "pinCode",
    "address1",
    "address2",
    "address3",
    "townName",
    "stateName",
    "mailID",
    "refundedDate",
    "accountOpenedDate",
    "voucherValidTill",
    "voucherValidTillExpiryDays",
    "approvedBy",
    "approvalMailDate"
})
public class DiscountVoucherDetails {

    @XmlElement(name = "GHSAccountNo")
    protected int ghsAccountNo;
    @XmlElement(name = "TotalInstallmentAmount", required = true)
    protected BigDecimal totalInstallmentAmount;
    @XmlElement(name = "GHSVoucherDiscount", required = true)
    protected BigDecimal ghsVoucherDiscount;
    @XmlElement(name = "VoucherNo")
    protected long voucherNo;
    @XmlElement(name = "IsAllowedGoldCoin")
    protected boolean isAllowedGoldCoin;
    @XmlElement(name = "ValidFrom", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar validFrom;
    @XmlElement(name = "ValidTill", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar validTill;
    @XmlElement(name = "Status")
    protected int status;
    @XmlElement(name = "VoucherStatus")
    protected int voucherStatus;
    @XmlElement(name = "RedeemedCMNo")
    protected String redeemedCMNo;
    @XmlElement(name = "RedeemedLocation")
    protected String redeemedLocation;
    @XmlElement(name = "RedemptionDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar redemptionDate;
    @XmlElement(name = "CreatedDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar createdDate;
    @XmlElement(name = "LastModifiedDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lastModifiedDate;
    @XmlElement(name = "LoginID")
    protected String loginID;
    @XmlElement(name = "LastModifiedID")
    protected String lastModifiedID;
    @XmlElement(name = "SuccessMessage")
    protected String successMessage;
    @XmlElement(name = "ErrorMessage")
    protected String errorMessage;
    @XmlElement(name = "MobileNo")
    protected String mobileNo;
    @XmlElement(name = "CustomerID")
    protected int customerID;
    @XmlElement(name = "CustomerName")
    protected String customerName;
    @XmlElement(name = "LocationCode")
    protected String locationCode;
    @XmlElement(name = "SchemeCode")
    protected String schemeCode;
    @XmlElement(name = "NoOfInstallmentsPayed")
    protected int noOfInstallmentsPayed;
    @XmlElement(name = "Title")
    protected String title;
    @XmlElement(name = "ULPMembershipID")
    protected String ulpMembershipID;
    @XmlElement(name = "PinCode")
    protected String pinCode;
    @XmlElement(name = "Address1")
    protected String address1;
    @XmlElement(name = "Address2")
    protected String address2;
    @XmlElement(name = "Address3")
    protected String address3;
    @XmlElement(name = "TownName")
    protected String townName;
    @XmlElement(name = "StateName")
    protected String stateName;
    @XmlElement(name = "MailID")
    protected String mailID;
    @XmlElement(name = "RefundedDate")
    protected String refundedDate;
    @XmlElement(name = "AccountOpenedDate")
    protected String accountOpenedDate;
    @XmlElement(name = "VoucherValidTill")
    protected String voucherValidTill;
    @XmlElement(name = "VoucherValidTillExpiryDays")
    protected int voucherValidTillExpiryDays;
    @XmlElement(name = "ApprovedBy")
    protected String approvedBy;
    @XmlElement(name = "ApprovalMailDate")
    protected String approvalMailDate;

    /**
     * Gets the value of the ghsAccountNo property.
     * 
     */
    public int getGHSAccountNo() {
        return ghsAccountNo;
    }

    /**
     * Sets the value of the ghsAccountNo property.
     * 
     */
    public void setGHSAccountNo(int value) {
        this.ghsAccountNo = value;
    }

    /**
     * Gets the value of the totalInstallmentAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getTotalInstallmentAmount() {
        return totalInstallmentAmount;
    }

    /**
     * Sets the value of the totalInstallmentAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setTotalInstallmentAmount(BigDecimal value) {
        this.totalInstallmentAmount = value;
    }

    /**
     * Gets the value of the ghsVoucherDiscount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getGHSVoucherDiscount() {
        return ghsVoucherDiscount;
    }

    /**
     * Sets the value of the ghsVoucherDiscount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setGHSVoucherDiscount(BigDecimal value) {
        this.ghsVoucherDiscount = value;
    }

    /**
     * Gets the value of the voucherNo property.
     * 
     */
    public long getVoucherNo() {
        return voucherNo;
    }

    /**
     * Sets the value of the voucherNo property.
     * 
     */
    public void setVoucherNo(long value) {
        this.voucherNo = value;
    }

    /**
     * Gets the value of the isAllowedGoldCoin property.
     * 
     */
    public boolean isIsAllowedGoldCoin() {
        return isAllowedGoldCoin;
    }

    /**
     * Sets the value of the isAllowedGoldCoin property.
     * 
     */
    public void setIsAllowedGoldCoin(boolean value) {
        this.isAllowedGoldCoin = value;
    }

    /**
     * Gets the value of the validFrom property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getValidFrom() {
        return validFrom;
    }

    /**
     * Sets the value of the validFrom property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setValidFrom(XMLGregorianCalendar value) {
        this.validFrom = value;
    }

    /**
     * Gets the value of the validTill property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getValidTill() {
        return validTill;
    }

    /**
     * Sets the value of the validTill property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setValidTill(XMLGregorianCalendar value) {
        this.validTill = value;
    }

    /**
     * Gets the value of the status property.
     * 
     */
    public int getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     */
    public void setStatus(int value) {
        this.status = value;
    }

    /**
     * Gets the value of the voucherStatus property.
     * 
     */
    public int getVoucherStatus() {
        return voucherStatus;
    }

    /**
     * Sets the value of the voucherStatus property.
     * 
     */
    public void setVoucherStatus(int value) {
        this.voucherStatus = value;
    }

    /**
     * Gets the value of the redeemedCMNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRedeemedCMNo() {
        return redeemedCMNo;
    }

    /**
     * Sets the value of the redeemedCMNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRedeemedCMNo(String value) {
        this.redeemedCMNo = value;
    }

    /**
     * Gets the value of the redeemedLocation property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRedeemedLocation() {
        return redeemedLocation;
    }

    /**
     * Sets the value of the redeemedLocation property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRedeemedLocation(String value) {
        this.redeemedLocation = value;
    }

    /**
     * Gets the value of the redemptionDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getRedemptionDate() {
        return redemptionDate;
    }

    /**
     * Sets the value of the redemptionDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setRedemptionDate(XMLGregorianCalendar value) {
        this.redemptionDate = value;
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
     * Gets the value of the successMessage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSuccessMessage() {
        return successMessage;
    }

    /**
     * Sets the value of the successMessage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSuccessMessage(String value) {
        this.successMessage = value;
    }

    /**
     * Gets the value of the errorMessage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * Sets the value of the errorMessage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setErrorMessage(String value) {
        this.errorMessage = value;
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
     * Gets the value of the customerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Sets the value of the customerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerName(String value) {
        this.customerName = value;
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
     * Gets the value of the schemeCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSchemeCode() {
        return schemeCode;
    }

    /**
     * Sets the value of the schemeCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSchemeCode(String value) {
        this.schemeCode = value;
    }

    /**
     * Gets the value of the noOfInstallmentsPayed property.
     * 
     */
    public int getNoOfInstallmentsPayed() {
        return noOfInstallmentsPayed;
    }

    /**
     * Sets the value of the noOfInstallmentsPayed property.
     * 
     */
    public void setNoOfInstallmentsPayed(int value) {
        this.noOfInstallmentsPayed = value;
    }

    /**
     * Gets the value of the title property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the value of the title property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTitle(String value) {
        this.title = value;
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
     * Gets the value of the townName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTownName() {
        return townName;
    }

    /**
     * Sets the value of the townName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTownName(String value) {
        this.townName = value;
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
     * Gets the value of the mailID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMailID() {
        return mailID;
    }

    /**
     * Sets the value of the mailID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMailID(String value) {
        this.mailID = value;
    }

    /**
     * Gets the value of the refundedDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRefundedDate() {
        return refundedDate;
    }

    /**
     * Sets the value of the refundedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRefundedDate(String value) {
        this.refundedDate = value;
    }

    /**
     * Gets the value of the accountOpenedDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAccountOpenedDate() {
        return accountOpenedDate;
    }

    /**
     * Sets the value of the accountOpenedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAccountOpenedDate(String value) {
        this.accountOpenedDate = value;
    }

    /**
     * Gets the value of the voucherValidTill property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVoucherValidTill() {
        return voucherValidTill;
    }

    /**
     * Sets the value of the voucherValidTill property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVoucherValidTill(String value) {
        this.voucherValidTill = value;
    }

    /**
     * Gets the value of the voucherValidTillExpiryDays property.
     * 
     */
    public int getVoucherValidTillExpiryDays() {
        return voucherValidTillExpiryDays;
    }

    /**
     * Sets the value of the voucherValidTillExpiryDays property.
     * 
     */
    public void setVoucherValidTillExpiryDays(int value) {
        this.voucherValidTillExpiryDays = value;
    }

    /**
     * Gets the value of the approvedBy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getApprovedBy() {
        return approvedBy;
    }

    /**
     * Sets the value of the approvedBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setApprovedBy(String value) {
        this.approvedBy = value;
    }

    /**
     * Gets the value of the approvalMailDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getApprovalMailDate() {
        return approvalMailDate;
    }

    /**
     * Sets the value of the approvalMailDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setApprovalMailDate(String value) {
        this.approvalMailDate = value;
    }

}
