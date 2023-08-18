
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
 *         &lt;element name="LineAttribute" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail}TotalLineAttribute" minOccurs="0"/&gt;
 *         &lt;element name="TotalDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal" minOccurs="0"/&gt;
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
    "lineAttribute",
    "totalDescription",
    "amount",
    "printable"
})
@XmlRootElement(name = "AddTransactionTotalLine", namespace = "http://tempuri.org/")
public class AddTransactionTotalLine {

    @XmlElement(name = "TransactionSessionId", namespace = "http://tempuri.org/")
    protected Long transactionSessionId;
    @XmlElement(name = "LineTimeStamp", namespace = "http://tempuri.org/", nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar lineTimeStamp;
    @XmlElement(name = "LineNumber", namespace = "http://tempuri.org/", nillable = true)
    protected Integer lineNumber;
    @XmlElement(name = "LineAttribute", namespace = "http://tempuri.org/")
    @XmlSchemaType(name = "string")
    protected TotalLineAttribute lineAttribute;
    @XmlElement(name = "TotalDescription", namespace = "http://tempuri.org/", nillable = true)
    protected String totalDescription;
    @XmlElement(name = "Amount", namespace = "http://tempuri.org/")
    protected BigDecimal amount;
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
     * Gets the value of the lineAttribute property.
     * 
     * @return
     *     possible object is
     *     {@link TotalLineAttribute }
     *     
     */
    public TotalLineAttribute getLineAttribute() {
        return lineAttribute;
    }

    /**
     * Sets the value of the lineAttribute property.
     * 
     * @param value
     *     allowed object is
     *     {@link TotalLineAttribute }
     *     
     */
    public void setLineAttribute(TotalLineAttribute value) {
        this.lineAttribute = value;
    }

    /**
     * Gets the value of the totalDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalDescription() {
        return totalDescription;
    }

    /**
     * Sets the value of the totalDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalDescription(String value) {
        this.totalDescription = value;
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
