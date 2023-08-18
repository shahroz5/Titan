
package com.titan.poss.integration.eghs.generated;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for GHRevenueDetail complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GHRevenueDetail"&gt;
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
 *         &lt;element name="ReversalCash" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ReversalCC" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ReversalDD" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ReversalCheque" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="RefundCash" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="RefundRO" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="BrandCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="BODPassword" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ACHAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="EmpSalDeductionAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ReversalACH" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="ReversalEmpSaldeduction" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="PayTMAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="RevPayTM" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="AirPayAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="RevAirPay" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GHRevenueDetail", propOrder = {
    "locationCode",
    "businessDate",
    "cashAmount",
    "ccRevenue",
    "ccCommission",
    "ddAmount",
    "chequeAmount",
    "netAmount",
    "reversalCash",
    "reversalCC",
    "reversalDD",
    "reversalCheque",
    "refundCash",
    "refundRO",
    "brandCode",
    "bodPassword",
    "achAmount",
    "empSalDeductionAmount",
    "reversalACH",
    "reversalEmpSaldeduction",
    "payTMAmount",
    "revPayTM",
    "airPayAmount",
    "revAirPay"
})
public class GHRevenueDetail {

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
    @XmlElement(name = "ReversalCash", required = true)
    protected BigDecimal reversalCash;
    @XmlElement(name = "ReversalCC", required = true)
    protected BigDecimal reversalCC;
    @XmlElement(name = "ReversalDD", required = true)
    protected BigDecimal reversalDD;
    @XmlElement(name = "ReversalCheque", required = true)
    protected BigDecimal reversalCheque;
    @XmlElement(name = "RefundCash", required = true)
    protected BigDecimal refundCash;
    @XmlElement(name = "RefundRO", required = true)
    protected BigDecimal refundRO;
    @XmlElement(name = "BrandCode")
    protected String brandCode;
    @XmlElement(name = "BODPassword")
    protected String bodPassword;
    @XmlElement(name = "ACHAmount", required = true)
    protected BigDecimal achAmount;
    @XmlElement(name = "EmpSalDeductionAmount", required = true)
    protected BigDecimal empSalDeductionAmount;
    @XmlElement(name = "ReversalACH", required = true)
    protected BigDecimal reversalACH;
    @XmlElement(name = "ReversalEmpSaldeduction", required = true)
    protected BigDecimal reversalEmpSaldeduction;
    @XmlElement(name = "PayTMAmount", required = true)
    protected BigDecimal payTMAmount;
    @XmlElement(name = "RevPayTM", required = true)
    protected BigDecimal revPayTM;
    @XmlElement(name = "AirPayAmount", required = true)
    protected BigDecimal airPayAmount;
    @XmlElement(name = "RevAirPay", required = true)
    protected BigDecimal revAirPay;

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
     * Gets the value of the reversalCash property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getReversalCash() {
        return reversalCash;
    }

    /**
     * Sets the value of the reversalCash property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setReversalCash(BigDecimal value) {
        this.reversalCash = value;
    }

    /**
     * Gets the value of the reversalCC property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getReversalCC() {
        return reversalCC;
    }

    /**
     * Sets the value of the reversalCC property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setReversalCC(BigDecimal value) {
        this.reversalCC = value;
    }

    /**
     * Gets the value of the reversalDD property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getReversalDD() {
        return reversalDD;
    }

    /**
     * Sets the value of the reversalDD property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setReversalDD(BigDecimal value) {
        this.reversalDD = value;
    }

    /**
     * Gets the value of the reversalCheque property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getReversalCheque() {
        return reversalCheque;
    }

    /**
     * Sets the value of the reversalCheque property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setReversalCheque(BigDecimal value) {
        this.reversalCheque = value;
    }

    /**
     * Gets the value of the refundCash property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getRefundCash() {
        return refundCash;
    }

    /**
     * Sets the value of the refundCash property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setRefundCash(BigDecimal value) {
        this.refundCash = value;
    }

    /**
     * Gets the value of the refundRO property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getRefundRO() {
        return refundRO;
    }

    /**
     * Sets the value of the refundRO property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setRefundRO(BigDecimal value) {
        this.refundRO = value;
    }

    /**
     * Gets the value of the brandCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBrandCode() {
        return brandCode;
    }

    /**
     * Sets the value of the brandCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBrandCode(String value) {
        this.brandCode = value;
    }

    /**
     * Gets the value of the bodPassword property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBODPassword() {
        return bodPassword;
    }

    /**
     * Sets the value of the bodPassword property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBODPassword(String value) {
        this.bodPassword = value;
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
     * Gets the value of the reversalACH property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getReversalACH() {
        return reversalACH;
    }

    /**
     * Sets the value of the reversalACH property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setReversalACH(BigDecimal value) {
        this.reversalACH = value;
    }

    /**
     * Gets the value of the reversalEmpSaldeduction property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getReversalEmpSaldeduction() {
        return reversalEmpSaldeduction;
    }

    /**
     * Sets the value of the reversalEmpSaldeduction property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setReversalEmpSaldeduction(BigDecimal value) {
        this.reversalEmpSaldeduction = value;
    }

    /**
     * Gets the value of the payTMAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getPayTMAmount() {
        return payTMAmount;
    }

    /**
     * Sets the value of the payTMAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setPayTMAmount(BigDecimal value) {
        this.payTMAmount = value;
    }

    /**
     * Gets the value of the revPayTM property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getRevPayTM() {
        return revPayTM;
    }

    /**
     * Sets the value of the revPayTM property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setRevPayTM(BigDecimal value) {
        this.revPayTM = value;
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
     * Gets the value of the revAirPay property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getRevAirPay() {
        return revAirPay;
    }

    /**
     * Sets the value of the revAirPay property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setRevAirPay(BigDecimal value) {
        this.revAirPay = value;
    }

}
