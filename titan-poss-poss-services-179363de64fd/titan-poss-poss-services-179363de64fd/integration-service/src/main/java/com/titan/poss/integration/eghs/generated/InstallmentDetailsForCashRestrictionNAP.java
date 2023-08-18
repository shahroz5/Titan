
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for InstallmentDetailsForCashRestrictionNAP complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="InstallmentDetailsForCashRestrictionNAP"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Locationcode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Docdate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="GHSNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="InstallmentNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Paymentcode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="GHSStatus" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ULPMembershipID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="MobileNo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "InstallmentDetailsForCashRestrictionNAP", propOrder = {
    "locationcode",
    "docdate",
    "ghsNo",
    "installmentNo",
    "paymentcode",
    "amount",
    "ghsStatus",
    "ulpMembershipID",
    "name",
    "mobileNo"
})
public class InstallmentDetailsForCashRestrictionNAP {

    @XmlElement(name = "Locationcode")
    protected String locationcode;
    @XmlElement(name = "Docdate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar docdate;
    @XmlElement(name = "GHSNo")
    protected int ghsNo;
    @XmlElement(name = "InstallmentNo")
    protected int installmentNo;
    @XmlElement(name = "Paymentcode")
    protected String paymentcode;
    @XmlElement(name = "Amount", required = true)
    protected BigDecimal amount;
    @XmlElement(name = "GHSStatus")
    protected int ghsStatus;
    @XmlElement(name = "ULPMembershipID")
    protected String ulpMembershipID;
    @XmlElement(name = "Name")
    protected String name;
    @XmlElement(name = "MobileNo")
    protected String mobileNo;

    /**
     * Gets the value of the locationcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLocationcode() {
        return locationcode;
    }

    /**
     * Sets the value of the locationcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLocationcode(String value) {
        this.locationcode = value;
    }

    /**
     * Gets the value of the docdate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDocdate() {
        return docdate;
    }

    /**
     * Sets the value of the docdate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDocdate(XMLGregorianCalendar value) {
        this.docdate = value;
    }

    /**
     * Gets the value of the ghsNo property.
     * 
     */
    public int getGHSNo() {
        return ghsNo;
    }

    /**
     * Sets the value of the ghsNo property.
     * 
     */
    public void setGHSNo(int value) {
        this.ghsNo = value;
    }

    /**
     * Gets the value of the installmentNo property.
     * 
     */
    public int getInstallmentNo() {
        return installmentNo;
    }

    /**
     * Sets the value of the installmentNo property.
     * 
     */
    public void setInstallmentNo(int value) {
        this.installmentNo = value;
    }

    /**
     * Gets the value of the paymentcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentcode() {
        return paymentcode;
    }

    /**
     * Sets the value of the paymentcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentcode(String value) {
        this.paymentcode = value;
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
     * Gets the value of the ghsStatus property.
     * 
     */
    public int getGHSStatus() {
        return ghsStatus;
    }

    /**
     * Sets the value of the ghsStatus property.
     * 
     */
    public void setGHSStatus(int value) {
        this.ghsStatus = value;
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

}
