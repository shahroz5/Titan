
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for POSS_CreditNoteDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="POSS_CreditNoteDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="AdjustedAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CreatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="CreditNoteType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="DocDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="DocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="FiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="LastModifiedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LastModifiedID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LoginID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NoOfTimesPrinted" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RefDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="RefDocType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="RefFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CustomerNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CFA_ProductCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Hold_CM_Doc_No" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Is_Grammage" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="InterBtqGHDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="InterBtqGHFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Remarks" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsInterBtqGHS" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="SourceCNNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="SourceCNType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="SourceFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="GHSBonus" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ChequeClearingDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LastReactivatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="LastSuspendedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="IsGoldRateProtected" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GoldRateProtectedExpiryDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="GoldRateProtected" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="Hold_Advance_Doc_No" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Hold_Customer_Doc_No" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="OriginalCNDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="OriginalCNFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="IsNewCN" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GRNWeight" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="InstrumentNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="IssuingBank" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="IsBehaviourActive" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Behaviour" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BehaviourParameters" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TotalCashCollected" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="IsRTGS" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsBlocked" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="POSSCNNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="eGHSCNNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CustomerDetails" type="{http://tempuri.org/}POSS_CustomerMaster" minOccurs="0"/&gt;
 *         &lt;element name="IsFromReversal" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GHSAccNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "POSS_CreditNoteDO", propOrder = {
    "adjustedAmount",
    "createdDate",
    "creditNoteType",
    "docDate",
    "docNo",
    "fiscalYear",
    "lastModifiedDate",
    "lastModifiedID",
    "locationCode",
    "loginID",
    "noOfTimesPrinted",
    "refDocNo",
    "status",
    "amount",
    "refDocType",
    "refFiscalYear",
    "customerNo",
    "cfaProductCode",
    "holdCMDocNo",
    "isGrammage",
    "interBtqGHDocNo",
    "interBtqGHFiscalYear",
    "remarks",
    "isInterBtqGHS",
    "sourceCNNo",
    "sourceCNType",
    "sourceFiscalYear",
    "ghsBonus",
    "chequeClearingDate",
    "lastReactivatedDate",
    "lastSuspendedDate",
    "isGoldRateProtected",
    "goldRateProtectedExpiryDate",
    "goldRateProtected",
    "holdAdvanceDocNo",
    "holdCustomerDocNo",
    "originalCNDocNo",
    "originalCNFiscalYear",
    "isNewCN",
    "grnWeight",
    "instrumentNo",
    "issuingBank",
    "isBehaviourActive",
    "behaviour",
    "behaviourParameters",
    "totalCashCollected",
    "isRTGS",
    "isBlocked",
    "posscnNo",
    "eghscnNo",
    "customerDetails",
    "isFromReversal",
    "ghsAccNo"
})
public class POSSCreditNoteDO {

    @XmlElement(name = "AdjustedAmount", required = true)
    protected BigDecimal adjustedAmount;
    @XmlElement(name = "CreatedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar createdDate;
    @XmlElement(name = "CreditNoteType")
    protected String creditNoteType;
    @XmlElement(name = "DocDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar docDate;
    @XmlElement(name = "DocNo")
    protected int docNo;
    @XmlElement(name = "FiscalYear")
    protected int fiscalYear;
    @XmlElement(name = "LastModifiedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lastModifiedDate;
    @XmlElement(name = "LastModifiedID")
    protected String lastModifiedID;
    @XmlElement(name = "LocationCode")
    protected String locationCode;
    @XmlElement(name = "LoginID")
    protected String loginID;
    @XmlElement(name = "NoOfTimesPrinted")
    protected int noOfTimesPrinted;
    @XmlElement(name = "RefDocNo")
    protected int refDocNo;
    @XmlElement(name = "Status")
    protected int status;
    @XmlElement(name = "Amount", required = true)
    protected BigDecimal amount;
    @XmlElement(name = "RefDocType")
    protected String refDocType;
    @XmlElement(name = "RefFiscalYear")
    protected int refFiscalYear;
    @XmlElement(name = "CustomerNo")
    protected int customerNo;
    @XmlElement(name = "CFA_ProductCode")
    protected String cfaProductCode;
    @XmlElement(name = "Hold_CM_Doc_No")
    protected int holdCMDocNo;
    @XmlElement(name = "Is_Grammage")
    protected int isGrammage;
    @XmlElement(name = "InterBtqGHDocNo")
    protected int interBtqGHDocNo;
    @XmlElement(name = "InterBtqGHFiscalYear")
    protected int interBtqGHFiscalYear;
    @XmlElement(name = "Remarks")
    protected String remarks;
    @XmlElement(name = "IsInterBtqGHS")
    protected boolean isInterBtqGHS;
    @XmlElement(name = "SourceCNNo")
    protected int sourceCNNo;
    @XmlElement(name = "SourceCNType")
    protected String sourceCNType;
    @XmlElement(name = "SourceFiscalYear")
    protected int sourceFiscalYear;
    @XmlElement(name = "GHSBonus", required = true)
    protected BigDecimal ghsBonus;
    @XmlElement(name = "ChequeClearingDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar chequeClearingDate;
    @XmlElement(name = "LastReactivatedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lastReactivatedDate;
    @XmlElement(name = "LastSuspendedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lastSuspendedDate;
    @XmlElement(name = "IsGoldRateProtected")
    protected boolean isGoldRateProtected;
    @XmlElement(name = "GoldRateProtectedExpiryDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar goldRateProtectedExpiryDate;
    @XmlElement(name = "GoldRateProtected", required = true)
    protected BigDecimal goldRateProtected;
    @XmlElement(name = "Hold_Advance_Doc_No")
    protected int holdAdvanceDocNo;
    @XmlElement(name = "Hold_Customer_Doc_No")
    protected int holdCustomerDocNo;
    @XmlElement(name = "OriginalCNDocNo")
    protected int originalCNDocNo;
    @XmlElement(name = "OriginalCNFiscalYear")
    protected int originalCNFiscalYear;
    @XmlElement(name = "IsNewCN")
    protected boolean isNewCN;
    @XmlElement(name = "GRNWeight", required = true)
    protected BigDecimal grnWeight;
    @XmlElement(name = "InstrumentNo")
    protected int instrumentNo;
    @XmlElement(name = "IssuingBank")
    protected String issuingBank;
    @XmlElement(name = "IsBehaviourActive")
    protected boolean isBehaviourActive;
    @XmlElement(name = "Behaviour")
    protected String behaviour;
    @XmlElement(name = "BehaviourParameters")
    protected String behaviourParameters;
    @XmlElement(name = "TotalCashCollected", required = true)
    protected BigDecimal totalCashCollected;
    @XmlElement(name = "IsRTGS")
    protected boolean isRTGS;
    @XmlElement(name = "IsBlocked")
    protected boolean isBlocked;
    @XmlElement(name = "POSSCNNo")
    protected int posscnNo;
    @XmlElement(name = "eGHSCNNo")
    protected int eghscnNo;
    @XmlElement(name = "CustomerDetails")
    protected POSSCustomerMaster customerDetails;
    @XmlElement(name = "IsFromReversal")
    protected boolean isFromReversal;
    @XmlElement(name = "GHSAccNo")
    protected int ghsAccNo;

    /**
     * Gets the value of the adjustedAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAdjustedAmount() {
        return adjustedAmount;
    }

    /**
     * Sets the value of the adjustedAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAdjustedAmount(BigDecimal value) {
        this.adjustedAmount = value;
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
     * Gets the value of the creditNoteType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCreditNoteType() {
        return creditNoteType;
    }

    /**
     * Sets the value of the creditNoteType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCreditNoteType(String value) {
        this.creditNoteType = value;
    }

    /**
     * Gets the value of the docDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDocDate() {
        return docDate;
    }

    /**
     * Sets the value of the docDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDocDate(XMLGregorianCalendar value) {
        this.docDate = value;
    }

    /**
     * Gets the value of the docNo property.
     * 
     */
    public int getDocNo() {
        return docNo;
    }

    /**
     * Sets the value of the docNo property.
     * 
     */
    public void setDocNo(int value) {
        this.docNo = value;
    }

    /**
     * Gets the value of the fiscalYear property.
     * 
     */
    public int getFiscalYear() {
        return fiscalYear;
    }

    /**
     * Sets the value of the fiscalYear property.
     * 
     */
    public void setFiscalYear(int value) {
        this.fiscalYear = value;
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
     * Gets the value of the noOfTimesPrinted property.
     * 
     */
    public int getNoOfTimesPrinted() {
        return noOfTimesPrinted;
    }

    /**
     * Sets the value of the noOfTimesPrinted property.
     * 
     */
    public void setNoOfTimesPrinted(int value) {
        this.noOfTimesPrinted = value;
    }

    /**
     * Gets the value of the refDocNo property.
     * 
     */
    public int getRefDocNo() {
        return refDocNo;
    }

    /**
     * Sets the value of the refDocNo property.
     * 
     */
    public void setRefDocNo(int value) {
        this.refDocNo = value;
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
     * Gets the value of the amount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Sets the value of the amount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAmount(BigDecimal value) {
        this.amount = value;
    }

    /**
     * Gets the value of the refDocType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRefDocType() {
        return refDocType;
    }

    /**
     * Sets the value of the refDocType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRefDocType(String value) {
        this.refDocType = value;
    }

    /**
     * Gets the value of the refFiscalYear property.
     * 
     */
    public int getRefFiscalYear() {
        return refFiscalYear;
    }

    /**
     * Sets the value of the refFiscalYear property.
     * 
     */
    public void setRefFiscalYear(int value) {
        this.refFiscalYear = value;
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
     * Gets the value of the cfaProductCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCFAProductCode() {
        return cfaProductCode;
    }

    /**
     * Sets the value of the cfaProductCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCFAProductCode(String value) {
        this.cfaProductCode = value;
    }

    /**
     * Gets the value of the holdCMDocNo property.
     * 
     */
    public int getHoldCMDocNo() {
        return holdCMDocNo;
    }

    /**
     * Sets the value of the holdCMDocNo property.
     * 
     */
    public void setHoldCMDocNo(int value) {
        this.holdCMDocNo = value;
    }

    /**
     * Gets the value of the isGrammage property.
     * 
     */
    public int getIsGrammage() {
        return isGrammage;
    }

    /**
     * Sets the value of the isGrammage property.
     * 
     */
    public void setIsGrammage(int value) {
        this.isGrammage = value;
    }

    /**
     * Gets the value of the interBtqGHDocNo property.
     * 
     */
    public int getInterBtqGHDocNo() {
        return interBtqGHDocNo;
    }

    /**
     * Sets the value of the interBtqGHDocNo property.
     * 
     */
    public void setInterBtqGHDocNo(int value) {
        this.interBtqGHDocNo = value;
    }

    /**
     * Gets the value of the interBtqGHFiscalYear property.
     * 
     */
    public int getInterBtqGHFiscalYear() {
        return interBtqGHFiscalYear;
    }

    /**
     * Sets the value of the interBtqGHFiscalYear property.
     * 
     */
    public void setInterBtqGHFiscalYear(int value) {
        this.interBtqGHFiscalYear = value;
    }

    /**
     * Gets the value of the remarks property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRemarks() {
        return remarks;
    }

    /**
     * Sets the value of the remarks property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRemarks(String value) {
        this.remarks = value;
    }

    /**
     * Gets the value of the isInterBtqGHS property.
     * 
     */
    public boolean isIsInterBtqGHS() {
        return isInterBtqGHS;
    }

    /**
     * Sets the value of the isInterBtqGHS property.
     * 
     */
    public void setIsInterBtqGHS(boolean value) {
        this.isInterBtqGHS = value;
    }

    /**
     * Gets the value of the sourceCNNo property.
     * 
     */
    public int getSourceCNNo() {
        return sourceCNNo;
    }

    /**
     * Sets the value of the sourceCNNo property.
     * 
     */
    public void setSourceCNNo(int value) {
        this.sourceCNNo = value;
    }

    /**
     * Gets the value of the sourceCNType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSourceCNType() {
        return sourceCNType;
    }

    /**
     * Sets the value of the sourceCNType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSourceCNType(String value) {
        this.sourceCNType = value;
    }

    /**
     * Gets the value of the sourceFiscalYear property.
     * 
     */
    public int getSourceFiscalYear() {
        return sourceFiscalYear;
    }

    /**
     * Sets the value of the sourceFiscalYear property.
     * 
     */
    public void setSourceFiscalYear(int value) {
        this.sourceFiscalYear = value;
    }

    /**
     * Gets the value of the ghsBonus property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getGHSBonus() {
        return ghsBonus;
    }

    /**
     * Sets the value of the ghsBonus property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setGHSBonus(BigDecimal value) {
        this.ghsBonus = value;
    }

    /**
     * Gets the value of the chequeClearingDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getChequeClearingDate() {
        return chequeClearingDate;
    }

    /**
     * Sets the value of the chequeClearingDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setChequeClearingDate(XMLGregorianCalendar value) {
        this.chequeClearingDate = value;
    }

    /**
     * Gets the value of the lastReactivatedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getLastReactivatedDate() {
        return lastReactivatedDate;
    }

    /**
     * Sets the value of the lastReactivatedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setLastReactivatedDate(XMLGregorianCalendar value) {
        this.lastReactivatedDate = value;
    }

    /**
     * Gets the value of the lastSuspendedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getLastSuspendedDate() {
        return lastSuspendedDate;
    }

    /**
     * Sets the value of the lastSuspendedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setLastSuspendedDate(XMLGregorianCalendar value) {
        this.lastSuspendedDate = value;
    }

    /**
     * Gets the value of the isGoldRateProtected property.
     * 
     */
    public boolean isIsGoldRateProtected() {
        return isGoldRateProtected;
    }

    /**
     * Sets the value of the isGoldRateProtected property.
     * 
     */
    public void setIsGoldRateProtected(boolean value) {
        this.isGoldRateProtected = value;
    }

    /**
     * Gets the value of the goldRateProtectedExpiryDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getGoldRateProtectedExpiryDate() {
        return goldRateProtectedExpiryDate;
    }

    /**
     * Sets the value of the goldRateProtectedExpiryDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setGoldRateProtectedExpiryDate(XMLGregorianCalendar value) {
        this.goldRateProtectedExpiryDate = value;
    }

    /**
     * Gets the value of the goldRateProtected property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getGoldRateProtected() {
        return goldRateProtected;
    }

    /**
     * Sets the value of the goldRateProtected property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setGoldRateProtected(BigDecimal value) {
        this.goldRateProtected = value;
    }

    /**
     * Gets the value of the holdAdvanceDocNo property.
     * 
     */
    public int getHoldAdvanceDocNo() {
        return holdAdvanceDocNo;
    }

    /**
     * Sets the value of the holdAdvanceDocNo property.
     * 
     */
    public void setHoldAdvanceDocNo(int value) {
        this.holdAdvanceDocNo = value;
    }

    /**
     * Gets the value of the holdCustomerDocNo property.
     * 
     */
    public int getHoldCustomerDocNo() {
        return holdCustomerDocNo;
    }

    /**
     * Sets the value of the holdCustomerDocNo property.
     * 
     */
    public void setHoldCustomerDocNo(int value) {
        this.holdCustomerDocNo = value;
    }

    /**
     * Gets the value of the originalCNDocNo property.
     * 
     */
    public int getOriginalCNDocNo() {
        return originalCNDocNo;
    }

    /**
     * Sets the value of the originalCNDocNo property.
     * 
     */
    public void setOriginalCNDocNo(int value) {
        this.originalCNDocNo = value;
    }

    /**
     * Gets the value of the originalCNFiscalYear property.
     * 
     */
    public int getOriginalCNFiscalYear() {
        return originalCNFiscalYear;
    }

    /**
     * Sets the value of the originalCNFiscalYear property.
     * 
     */
    public void setOriginalCNFiscalYear(int value) {
        this.originalCNFiscalYear = value;
    }

    /**
     * Gets the value of the isNewCN property.
     * 
     */
    public boolean isIsNewCN() {
        return isNewCN;
    }

    /**
     * Sets the value of the isNewCN property.
     * 
     */
    public void setIsNewCN(boolean value) {
        this.isNewCN = value;
    }

    /**
     * Gets the value of the grnWeight property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getGRNWeight() {
        return grnWeight;
    }

    /**
     * Sets the value of the grnWeight property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setGRNWeight(BigDecimal value) {
        this.grnWeight = value;
    }

    /**
     * Gets the value of the instrumentNo property.
     * 
     */
    public int getInstrumentNo() {
        return instrumentNo;
    }

    /**
     * Sets the value of the instrumentNo property.
     * 
     */
    public void setInstrumentNo(int value) {
        this.instrumentNo = value;
    }

    /**
     * Gets the value of the issuingBank property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIssuingBank() {
        return issuingBank;
    }

    /**
     * Sets the value of the issuingBank property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIssuingBank(String value) {
        this.issuingBank = value;
    }

    /**
     * Gets the value of the isBehaviourActive property.
     * 
     */
    public boolean isIsBehaviourActive() {
        return isBehaviourActive;
    }

    /**
     * Sets the value of the isBehaviourActive property.
     * 
     */
    public void setIsBehaviourActive(boolean value) {
        this.isBehaviourActive = value;
    }

    /**
     * Gets the value of the behaviour property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBehaviour() {
        return behaviour;
    }

    /**
     * Sets the value of the behaviour property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBehaviour(String value) {
        this.behaviour = value;
    }

    /**
     * Gets the value of the behaviourParameters property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBehaviourParameters() {
        return behaviourParameters;
    }

    /**
     * Sets the value of the behaviourParameters property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBehaviourParameters(String value) {
        this.behaviourParameters = value;
    }

    /**
     * Gets the value of the totalCashCollected property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getTotalCashCollected() {
        return totalCashCollected;
    }

    /**
     * Sets the value of the totalCashCollected property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setTotalCashCollected(BigDecimal value) {
        this.totalCashCollected = value;
    }

    /**
     * Gets the value of the isRTGS property.
     * 
     */
    public boolean isIsRTGS() {
        return isRTGS;
    }

    /**
     * Sets the value of the isRTGS property.
     * 
     */
    public void setIsRTGS(boolean value) {
        this.isRTGS = value;
    }

    /**
     * Gets the value of the isBlocked property.
     * 
     */
    public boolean isIsBlocked() {
        return isBlocked;
    }

    /**
     * Sets the value of the isBlocked property.
     * 
     */
    public void setIsBlocked(boolean value) {
        this.isBlocked = value;
    }

    /**
     * Gets the value of the posscnNo property.
     * 
     */
    public int getPOSSCNNo() {
        return posscnNo;
    }

    /**
     * Sets the value of the posscnNo property.
     * 
     */
    public void setPOSSCNNo(int value) {
        this.posscnNo = value;
    }

    /**
     * Gets the value of the eghscnNo property.
     * 
     */
    public int getEGHSCNNo() {
        return eghscnNo;
    }

    /**
     * Sets the value of the eghscnNo property.
     * 
     */
    public void setEGHSCNNo(int value) {
        this.eghscnNo = value;
    }

    /**
     * Gets the value of the customerDetails property.
     * 
     * @return
     *     possible object is
     *     {@link POSSCustomerMaster }
     *     
     */
    public POSSCustomerMaster getCustomerDetails() {
        return customerDetails;
    }

    /**
     * Sets the value of the customerDetails property.
     * 
     * @param value
     *     allowed object is
     *     {@link POSSCustomerMaster }
     *     
     */
    public void setCustomerDetails(POSSCustomerMaster value) {
        this.customerDetails = value;
    }

    /**
     * Gets the value of the isFromReversal property.
     * 
     */
    public boolean isIsFromReversal() {
        return isFromReversal;
    }

    /**
     * Sets the value of the isFromReversal property.
     * 
     */
    public void setIsFromReversal(boolean value) {
        this.isFromReversal = value;
    }

    /**
     * Gets the value of the ghsAccNo property.
     * 
     */
    public int getGHSAccNo() {
        return ghsAccNo;
    }

    /**
     * Sets the value of the ghsAccNo property.
     * 
     */
    public void setGHSAccNo(int value) {
        this.ghsAccNo = value;
    }

}
