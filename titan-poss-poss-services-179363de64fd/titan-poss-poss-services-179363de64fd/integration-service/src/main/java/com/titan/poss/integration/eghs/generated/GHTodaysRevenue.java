
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for GHTodaysRevenue complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GHTodaysRevenue"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="LocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BusinessDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="CashAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CCRevenue" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="CCCommission" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="DDAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ChequeAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="NetAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ACHAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="EmpSalDeductionAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GHTodaysRevenue", propOrder = {
    "locationCode",
    "businessDate",
    "cashAmount",
    "ccRevenue",
    "ccCommission",
    "ddAmount",
    "chequeAmount",
    "netAmount",
    "achAmount",
    "empSalDeductionAmount",
    "airPayAmount",
    "refundRO"
})
public class GHTodaysRevenue {

    @XmlElement(name = "LocationCode")
    protected String locationCode;
    @XmlElement(name = "BusinessDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar businessDate;
    @XmlElement(name = "CashAmount", required = true)
    protected BigDecimal cashAmount;
    @XmlElement(name = "CCRevenue", required = true)
    protected BigDecimal ccRevenue;
    @XmlElement(name = "CCCommission", required = true)
    protected BigDecimal ccCommission;
    @XmlElement(name = "DDAmount", required = true)
    protected BigDecimal ddAmount;
    @XmlElement(name = "ChequeAmount", required = true)
    protected BigDecimal chequeAmount;
    @XmlElement(name = "NetAmount", required = true)
    protected BigDecimal netAmount;
    @XmlElement(name = "ACHAmount", required = true)
    protected BigDecimal achAmount;
    @XmlElement(name = "EmpSalDeductionAmount", required = true)
    protected BigDecimal empSalDeductionAmount;
    @XmlElement(name = "AirPayAmount",required = true)
    protected BigDecimal airPayAmount;
    @XmlElement(name = "RefundRO",required = true)
    protected BigDecimal refundRO;
   
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
     * Gets the value of the businessDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getBusinessDate() {
        return businessDate;
    }

    /**
     * Sets the value of the businessDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setBusinessDate(XMLGregorianCalendar value) {
        this.businessDate = value;
    }

    /**
     * Gets the value of the cashAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getCashAmount() {
        return cashAmount;
    }

    /**
     * Sets the value of the cashAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setCashAmount(BigDecimal value) {
        this.cashAmount = value;
    }

    /**
     * Gets the value of the ccRevenue property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getCCRevenue() {
        return ccRevenue;
    }

    /**
     * Sets the value of the ccRevenue property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setCCRevenue(BigDecimal value) {
        this.ccRevenue = value;
    }

    /**
     * Gets the value of the ccCommission property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getCCCommission() {
        return ccCommission;
    }

    /**
     * Sets the value of the ccCommission property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setCCCommission(BigDecimal value) {
        this.ccCommission = value;
    }

    /**
     * Gets the value of the ddAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getDDAmount() {
        return ddAmount;
    }

    /**
     * Sets the value of the ddAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setDDAmount(BigDecimal value) {
        this.ddAmount = value;
    }

    /**
     * Gets the value of the chequeAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getChequeAmount() {
        return chequeAmount;
    }

    /**
     * Sets the value of the chequeAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setChequeAmount(BigDecimal value) {
        this.chequeAmount = value;
    }

    /**
     * Gets the value of the netAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getNetAmount() {
        return netAmount;
    }

    /**
     * Sets the value of the netAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setNetAmount(BigDecimal value) {
        this.netAmount = value;
    }

    /**
     * Gets the value of the achAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getACHAmount() {
        return achAmount;
    }

    /**
     * Sets the value of the achAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setACHAmount(BigDecimal value) {
        this.achAmount = value;
    }

    /**
     * Gets the value of the empSalDeductionAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getEmpSalDeductionAmount() {
        return empSalDeductionAmount;
    }

    /**
     * Sets the value of the empSalDeductionAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setEmpSalDeductionAmount(BigDecimal value) {
        this.empSalDeductionAmount = value;
    }
    /**
     * Gets the value of the airPayAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAirPayAmount() {
        return airPayAmount;
    }

    /**
     * Sets the value of the airPayAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAirPayAmount(BigDecimal value) {
        this.airPayAmount = value;
    }
    /**
     * Gets the value of the UPIAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     
     */

	public BigDecimal getRefundRO() {
		return refundRO;
	}

	public void setRefundRO(BigDecimal refundRO) {
		this.refundRO = refundRO;
	}
    
    /**
     * Sets the value of the roPayment property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */

	
   

	
    

}
