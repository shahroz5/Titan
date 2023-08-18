
package com.titan.poss.integration.dial.cctv.generated;

import java.math.BigDecimal;
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
 *         &lt;element name="LineTimeStamp" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/&gt;
 *         &lt;element name="LineNumber" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/&gt;
 *         &lt;element name="ItemAttribute" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}SaleLineAttribute" minOccurs="0"/&gt;
 *         &lt;element name="ScanAttribute" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}ScanAttribute" minOccurs="0"/&gt;
 *         &lt;element name="ItemID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ItemDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ItemQuantity" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="ItemUnitMeasure" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ItemUnitPrice" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="DiscountType" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}DiscountType" minOccurs="0"/&gt;
 *         &lt;element name="Discount" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="TotalAmount" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="BranchLinkedTo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TillLinkedTo" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/&gt;
 *         &lt;element name="TransactionNumberLinkedTo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TransactionTimestampLinkedTo" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/&gt;
 *         &lt;element name="GrantedBy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Printable" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/&gt;
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
    "lineTimeStamp",
    "lineNumber",
    "itemAttribute",
    "scanAttribute",
    "itemID",
    "itemDescription",
    "itemQuantity",
    "itemUnitMeasure",
    "itemUnitPrice",
    "discountType",
    "discount",
    "totalAmount",
    "branchLinkedTo",
    "tillLinkedTo",
    "transactionNumberLinkedTo",
    "transactionTimestampLinkedTo",
    "grantedBy",
    "printable"
})
@XmlRootElement(name = "AddTransactionSaleLine", namespace = "http://tempuri.org/")
public class AddTransactionSaleLine {

    @XmlElement(name = "TransactionSessionId", namespace = "http://tempuri.org/")
    protected Long transactionSessionId;
    @XmlElement(name = "LineTimeStamp", namespace = "http://tempuri.org/", nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lineTimeStamp;
    @XmlElement(name = "LineNumber", namespace = "http://tempuri.org/", nillable = true)
    protected Integer lineNumber;
    @XmlElement(name = "ItemAttribute", namespace = "http://tempuri.org/")
    @XmlSchemaType(name = "string")
    protected SaleLineAttribute itemAttribute;
    @XmlElement(name = "ScanAttribute", namespace = "http://tempuri.org/")
    @XmlSchemaType(name = "string")
    protected ScanAttribute scanAttribute;
    @XmlElement(name = "ItemID", namespace = "http://tempuri.org/", nillable = true)
    protected String itemID;
    @XmlElement(name = "ItemDescription", namespace = "http://tempuri.org/", nillable = true)
    protected String itemDescription;
    @XmlElement(name = "ItemQuantity", namespace = "http://tempuri.org/")
    protected BigDecimal itemQuantity;
    @XmlElement(name = "ItemUnitMeasure", namespace = "http://tempuri.org/", nillable = true)
    protected String itemUnitMeasure;
    @XmlElement(name = "ItemUnitPrice", namespace = "http://tempuri.org/")
    protected BigDecimal itemUnitPrice;
    @XmlElement(name = "DiscountType", namespace = "http://tempuri.org/")
    @XmlSchemaType(name = "string")
    protected DiscountType discountType;
    @XmlElement(name = "Discount", namespace = "http://tempuri.org/", nillable = true)
    protected BigDecimal discount;
    @XmlElement(name = "TotalAmount", namespace = "http://tempuri.org/")
    protected BigDecimal totalAmount;
    @XmlElement(name = "BranchLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    protected String branchLinkedTo;
    @XmlElement(name = "TillLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    protected Integer tillLinkedTo;
    @XmlElement(name = "TransactionNumberLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    protected String transactionNumberLinkedTo;
    @XmlElement(name = "TransactionTimestampLinkedTo", namespace = "http://tempuri.org/", nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar transactionTimestampLinkedTo;
    @XmlElement(name = "GrantedBy", namespace = "http://tempuri.org/", nillable = true)
    protected String grantedBy;
    @XmlElement(name = "Printable", namespace = "http://tempuri.org/")
    protected Boolean printable;

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
     * Gets the value of the lineTimeStamp property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getLineTimeStamp() {
        return lineTimeStamp;
    }

    /**
     * Sets the value of the lineTimeStamp property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setLineTimeStamp(XMLGregorianCalendar value) {
        this.lineTimeStamp = value;
    }

    /**
     * Gets the value of the lineNumber property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getLineNumber() {
        return lineNumber;
    }

    /**
     * Sets the value of the lineNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setLineNumber(Integer value) {
        this.lineNumber = value;
    }

    /**
     * Gets the value of the itemAttribute property.
     * 
     * @return
     *     possible object is
     *     {@link SaleLineAttribute }
     *     
     */
    public SaleLineAttribute getItemAttribute() {
        return itemAttribute;
    }

    /**
     * Sets the value of the itemAttribute property.
     * 
     * @param value
     *     allowed object is
     *     {@link SaleLineAttribute }
     *     
     */
    public void setItemAttribute(SaleLineAttribute value) {
        this.itemAttribute = value;
    }

    /**
     * Gets the value of the scanAttribute property.
     * 
     * @return
     *     possible object is
     *     {@link ScanAttribute }
     *     
     */
    public ScanAttribute getScanAttribute() {
        return scanAttribute;
    }

    /**
     * Sets the value of the scanAttribute property.
     * 
     * @param value
     *     allowed object is
     *     {@link ScanAttribute }
     *     
     */
    public void setScanAttribute(ScanAttribute value) {
        this.scanAttribute = value;
    }

    /**
     * Gets the value of the itemID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getItemID() {
        return itemID;
    }

    /**
     * Sets the value of the itemID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setItemID(String value) {
        this.itemID = value;
    }

    /**
     * Gets the value of the itemDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getItemDescription() {
        return itemDescription;
    }

    /**
     * Sets the value of the itemDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setItemDescription(String value) {
        this.itemDescription = value;
    }

    /**
     * Gets the value of the itemQuantity property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getItemQuantity() {
        return itemQuantity;
    }

    /**
     * Sets the value of the itemQuantity property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setItemQuantity(BigDecimal value) {
        this.itemQuantity = value;
    }

    /**
     * Gets the value of the itemUnitMeasure property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getItemUnitMeasure() {
        return itemUnitMeasure;
    }

    /**
     * Sets the value of the itemUnitMeasure property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setItemUnitMeasure(String value) {
        this.itemUnitMeasure = value;
    }

    /**
     * Gets the value of the itemUnitPrice property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getItemUnitPrice() {
        return itemUnitPrice;
    }

    /**
     * Sets the value of the itemUnitPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setItemUnitPrice(BigDecimal value) {
        this.itemUnitPrice = value;
    }

    /**
     * Gets the value of the discountType property.
     * 
     * @return
     *     possible object is
     *     {@link DiscountType }
     *     
     */
    public DiscountType getDiscountType() {
        return discountType;
    }

    /**
     * Sets the value of the discountType property.
     * 
     * @param value
     *     allowed object is
     *     {@link DiscountType }
     *     
     */
    public void setDiscountType(DiscountType value) {
        this.discountType = value;
    }

    /**
     * Gets the value of the discount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getDiscount() {
        return discount;
    }

    /**
     * Sets the value of the discount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setDiscount(BigDecimal value) {
        this.discount = value;
    }

    /**
     * Gets the value of the totalAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    /**
     * Sets the value of the totalAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setTotalAmount(BigDecimal value) {
        this.totalAmount = value;
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
     * Gets the value of the tillLinkedTo property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getTillLinkedTo() {
        return tillLinkedTo;
    }

    /**
     * Sets the value of the tillLinkedTo property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setTillLinkedTo(Integer value) {
        this.tillLinkedTo = value;
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
     * Gets the value of the transactionTimestampLinkedTo property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getTransactionTimestampLinkedTo() {
        return transactionTimestampLinkedTo;
    }

    /**
     * Sets the value of the transactionTimestampLinkedTo property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setTransactionTimestampLinkedTo(XMLGregorianCalendar value) {
        this.transactionTimestampLinkedTo = value;
    }

    /**
     * Gets the value of the grantedBy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGrantedBy() {
        return grantedBy;
    }

    /**
     * Sets the value of the grantedBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGrantedBy(String value) {
        this.grantedBy = value;
    }

    /**
     * Gets the value of the printable property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isPrintable() {
        return printable;
    }

    /**
     * Sets the value of the printable property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setPrintable(Boolean value) {
        this.printable = value;
    }

}
