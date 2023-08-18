
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
 *         &lt;element name="LineAtttribute" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}PaymentLineAttribute" minOccurs="0"/&gt;
 *         &lt;element name="PaymentDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CurrencyCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CurrencyAmount" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="ExchangeRate" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
 *         &lt;element name="PaymentTypeID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="CardType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="LoyaltyPoints" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
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
    "lineAtttribute",
    "paymentDescription",
    "currencyCode",
    "currencyAmount",
    "exchangeRate",
    "amount",
    "paymentTypeID",
    "cardType",
    "loyaltyPoints",
    "printable"
})
@XmlRootElement(name = "AddTransactionPaymentLine", namespace = "http://tempuri.org/")
public class AddTransactionPaymentLine {

    @XmlElement(name = "TransactionSessionId", namespace = "http://tempuri.org/")
    protected Long transactionSessionId;
    @XmlElement(name = "LineTimeStamp", namespace = "http://tempuri.org/", nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lineTimeStamp;
    @XmlElement(name = "LineNumber", namespace = "http://tempuri.org/", nillable = true)
    protected Integer lineNumber;
    @XmlElement(name = "LineAtttribute", namespace = "http://tempuri.org/")
    @XmlSchemaType(name = "string")
    protected PaymentLineAttribute lineAtttribute;
    @XmlElement(name = "PaymentDescription", namespace = "http://tempuri.org/", nillable = true)
    protected String paymentDescription;
    @XmlElement(name = "CurrencyCode", namespace = "http://tempuri.org/", nillable = true)
    protected String currencyCode;
    @XmlElement(name = "CurrencyAmount", namespace = "http://tempuri.org/", nillable = true)
    protected BigDecimal currencyAmount;
    @XmlElement(name = "ExchangeRate", namespace = "http://tempuri.org/", nillable = true)
    protected BigDecimal exchangeRate;
    @XmlElement(name = "Amount", namespace = "http://tempuri.org/")
    protected BigDecimal amount;
    @XmlElement(name = "PaymentTypeID", namespace = "http://tempuri.org/", nillable = true)
    protected String paymentTypeID;
    @XmlElement(name = "CardType", namespace = "http://tempuri.org/", nillable = true)
    protected String cardType;
    @XmlElement(name = "LoyaltyPoints", namespace = "http://tempuri.org/", nillable = true)
    protected BigDecimal loyaltyPoints;
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
     * Gets the value of the lineAtttribute property.
     * 
     * @return
     *     possible object is
     *     {@link PaymentLineAttribute }
     *     
     */
    public PaymentLineAttribute getLineAtttribute() {
        return lineAtttribute;
    }

    /**
     * Sets the value of the lineAtttribute property.
     * 
     * @param value
     *     allowed object is
     *     {@link PaymentLineAttribute }
     *     
     */
    public void setLineAtttribute(PaymentLineAttribute value) {
        this.lineAtttribute = value;
    }

    /**
     * Gets the value of the paymentDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentDescription() {
        return paymentDescription;
    }

    /**
     * Sets the value of the paymentDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentDescription(String value) {
        this.paymentDescription = value;
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
     * Gets the value of the currencyAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getCurrencyAmount() {
        return currencyAmount;
    }

    /**
     * Sets the value of the currencyAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setCurrencyAmount(BigDecimal value) {
        this.currencyAmount = value;
    }

    /**
     * Gets the value of the exchangeRate property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    /**
     * Sets the value of the exchangeRate property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setExchangeRate(BigDecimal value) {
        this.exchangeRate = value;
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
     * Gets the value of the paymentTypeID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentTypeID() {
        return paymentTypeID;
    }

    /**
     * Sets the value of the paymentTypeID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentTypeID(String value) {
        this.paymentTypeID = value;
    }

    /**
     * Gets the value of the cardType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCardType() {
        return cardType;
    }

    /**
     * Sets the value of the cardType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCardType(String value) {
        this.cardType = value;
    }

    /**
     * Gets the value of the loyaltyPoints property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getLoyaltyPoints() {
        return loyaltyPoints;
    }

    /**
     * Sets the value of the loyaltyPoints property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setLoyaltyPoints(BigDecimal value) {
        this.loyaltyPoints = value;
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
