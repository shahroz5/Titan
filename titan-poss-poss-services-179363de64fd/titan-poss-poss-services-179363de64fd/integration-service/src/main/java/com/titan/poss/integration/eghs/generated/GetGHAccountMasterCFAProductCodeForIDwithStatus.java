
package com.titan.poss.integration.eghs.generated;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="fDocNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="fLocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="fFiscalYear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
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
    "fDocNo",
    "fLocationCode",
    "fFiscalYear"
})
@XmlRootElement(name = "GetGH_Account_Master_CFA_ProductCode_ForIDwithStatus")
public class GetGHAccountMasterCFAProductCodeForIDwithStatus {

    protected int fDocNo;
    protected String fLocationCode;
    protected int fFiscalYear;

    /**
     * Gets the value of the fDocNo property.
     * 
     */
    public int getFDocNo() {
        return fDocNo;
    }

    /**
     * Sets the value of the fDocNo property.
     * 
     */
    public void setFDocNo(int value) {
        this.fDocNo = value;
    }

    /**
     * Gets the value of the fLocationCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFLocationCode() {
        return fLocationCode;
    }

    /**
     * Sets the value of the fLocationCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFLocationCode(String value) {
        this.fLocationCode = value;
    }

    /**
     * Gets the value of the fFiscalYear property.
     * 
     */
    public int getFFiscalYear() {
        return fFiscalYear;
    }

    /**
     * Sets the value of the fFiscalYear property.
     * 
     */
    public void setFFiscalYear(int value) {
        this.fFiscalYear = value;
    }

}
