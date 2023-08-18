
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="TransactionSessionId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/&gt;
 *         &lt;element name="Branch" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TillDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TransactionNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BranchLinkedTo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TillDescriptionLinkedTo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TransactionNumberLinkedTo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TransactionTimestamp" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/&gt;
 *         &lt;element name="Debitor" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Cashier" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CurrencyCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TransactionType" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}TransactionType" minOccurs="0"/&gt;
 *         &lt;element name="EmployeePurchase" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/&gt;
 *         &lt;element name="OutsideOpeningHours" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}OutsideOpeningHours" minOccurs="0"/&gt;
 *         &lt;element name="MaximumScanGap" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "transactionSessionId",
    "branch",
    "tillDescription",
    "transactionNumber",
    "branchLinkedTo",
    "tillDescriptionLinkedTo",
    "transactionNumberLinkedTo",
    "transactionTimestamp",
    "debitor",
    "cashier",
    "currencyCode",
    "transactionType",
    "employeePurchase",
    "outsideOpeningHours",
    "maximumScanGap"
})
@XmlRootElement(name = "BeginTransactionWithTillLookup", namespace = "http://tempuri.org/")
public class BeginTransactionWithTillLookup {

    @XmlElement(name = "TransactionSessionId", namespace = "http://tempuri.org/", nillable = true)
    protected Long transactionSessionId;
    @XmlElement(name = "Branch", namespace = "http://tempuri.org/", nillable = true)
    protected String branch;
    @XmlElement(name = "TillDescription", namespace = "http://tempuri.org/", nillable = true)
    protected String tillDescription;
    @XmlElement(name = "TransactionNumber", namespace = "http://tempuri.org/", nillable = true)
    protected String transactionNumber;
    @XmlElement(name = "BranchLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    protected String branchLinkedTo;
    @XmlElement(name = "TillDescriptionLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    protected String tillDescriptionLinkedTo;
    @XmlElement(name = "TransactionNumberLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    protected String transactionNumberLinkedTo;
    @XmlElement(name = "TransactionTimestamp", namespace = "http://tempuri.org/", nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar transactionTimestamp;
    @XmlElement(name = "Debitor", namespace = "http://tempuri.org/", nillable = true)
    protected String debitor;
    @XmlElement(name = "Cashier", namespace = "http://tempuri.org/", nillable = true)
    protected String cashier;
    @XmlElement(name = "CurrencyCode", namespace = "http://tempuri.org/", nillable = true)
    protected String currencyCode;
    @XmlElement(name = "TransactionType", namespace = "http://tempuri.org/")
    @XmlSchemaType(name = "string")
    protected TransactionType transactionType;
    @XmlElement(name = "EmployeePurchase", namespace = "http://tempuri.org/")
    protected Boolean employeePurchase;
    @XmlElement(name = "OutsideOpeningHours", namespace = "http://tempuri.org/", nillable = true)
    @XmlSchemaType(name = "string")
    protected OutsideOpeningHours outsideOpeningHours;
    @XmlElement(name = "MaximumScanGap", namespace = "http://tempuri.org/", nillable = true)
    protected Integer maximumScanGap;

    /**
     * Gets the value of the transactionSessionId property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getTransactionSessionId() {
        return transactionSessionId;
    }

    /**
     * Sets the value of the transactionSessionId property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setTransactionSessionId(Long value) {
        this.transactionSessionId = value;
    }

    /**
     * Gets the value of the branch property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBranch() {
        return branch;
    }

    /**
     * Sets the value of the branch property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBranch(String value) {
        this.branch = value;
    }

    /**
     * Gets the value of the tillDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTillDescription() {
        return tillDescription;
    }

    /**
     * Sets the value of the tillDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTillDescription(String value) {
        this.tillDescription = value;
    }

    /**
     * Gets the value of the transactionNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransactionNumber() {
        return transactionNumber;
    }

    /**
     * Sets the value of the transactionNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransactionNumber(String value) {
        this.transactionNumber = value;
    }

    /**
     * Gets the value of the branchLinkedTo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBranchLinkedTo() {
        return branchLinkedTo;
    }

    /**
     * Sets the value of the branchLinkedTo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBranchLinkedTo(String value) {
        this.branchLinkedTo = value;
    }

    /**
     * Gets the value of the tillDescriptionLinkedTo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTillDescriptionLinkedTo() {
        return tillDescriptionLinkedTo;
    }

    /**
     * Sets the value of the tillDescriptionLinkedTo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTillDescriptionLinkedTo(String value) {
        this.tillDescriptionLinkedTo = value;
    }

    /**
     * Gets the value of the transactionNumberLinkedTo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransactionNumberLinkedTo() {
        return transactionNumberLinkedTo;
    }

    /**
     * Sets the value of the transactionNumberLinkedTo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransactionNumberLinkedTo(String value) {
        this.transactionNumberLinkedTo = value;
    }

    /**
     * Gets the value of the transactionTimestamp property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getTransactionTimestamp() {
        return transactionTimestamp;
    }

    /**
     * Sets the value of the transactionTimestamp property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setTransactionTimestamp(XMLGregorianCalendar value) {
        this.transactionTimestamp = value;
    }

    /**
     * Gets the value of the debitor property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDebitor() {
        return debitor;
    }

    /**
     * Sets the value of the debitor property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDebitor(String value) {
        this.debitor = value;
    }

    /**
     * Gets the value of the cashier property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCashier() {
        return cashier;
    }

    /**
     * Sets the value of the cashier property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCashier(String value) {
        this.cashier = value;
    }

    /**
     * Gets the value of the currencyCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrencyCode() {
        return currencyCode;
    }

    /**
     * Sets the value of the currencyCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrencyCode(String value) {
        this.currencyCode = value;
    }

    /**
     * Gets the value of the transactionType property.
     * 
     * @return
     *     possible object is
     *     {@link TransactionType }
     *     
     */
    public TransactionType getTransactionType() {
        return transactionType;
    }

    /**
     * Sets the value of the transactionType property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransactionType }
     *     
     */
    public void setTransactionType(TransactionType value) {
        this.transactionType = value;
    }

    /**
     * Gets the value of the employeePurchase property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isEmployeePurchase() {
        return employeePurchase;
    }

    /**
     * Sets the value of the employeePurchase property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setEmployeePurchase(Boolean value) {
        this.employeePurchase = value;
    }

    /**
     * Gets the value of the outsideOpeningHours property.
     * 
     * @return
     *     possible object is
     *     {@link OutsideOpeningHours }
     *     
     */
    public OutsideOpeningHours getOutsideOpeningHours() {
        return outsideOpeningHours;
    }

    /**
     * Sets the value of the outsideOpeningHours property.
     * 
     * @param value
     *     allowed object is
     *     {@link OutsideOpeningHours }
     *     
     */
    public void setOutsideOpeningHours(OutsideOpeningHours value) {
        this.outsideOpeningHours = value;
    }

    /**
     * Gets the value of the maximumScanGap property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getMaximumScanGap() {
        return maximumScanGap;
    }

    /**
     * Sets the value of the maximumScanGap property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setMaximumScanGap(Integer value) {
        this.maximumScanGap = value;
    }

}
