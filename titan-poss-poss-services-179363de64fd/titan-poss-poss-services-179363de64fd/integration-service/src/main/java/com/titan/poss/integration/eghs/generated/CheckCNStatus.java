
package com.titan.poss.integration.eghs.generated;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


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
 *         &lt;element name="CNNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CNFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="locationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "cnNo",
    "cnFiscalYear",
    "locationCode"
})
@XmlRootElement(name = "CheckCNStatus")
public class CheckCNStatus {

    @XmlElement(name = "CNNo")
    protected int cnNo;
    @XmlElement(name = "CNFiscalYear")
    protected int cnFiscalYear;
    protected String locationCode;

    /**
     * Gets the value of the cnNo property.
     * 
     */
    public int getCNNo() {
        return cnNo;
    }

    /**
     * Sets the value of the cnNo property.
     * 
     */
    public void setCNNo(int value) {
        this.cnNo = value;
    }

    /**
     * Gets the value of the cnFiscalYear property.
     * 
     */
    public int getCNFiscalYear() {
        return cnFiscalYear;
    }

    /**
     * Sets the value of the cnFiscalYear property.
     * 
     */
    public void setCNFiscalYear(int value) {
        this.cnFiscalYear = value;
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

}
