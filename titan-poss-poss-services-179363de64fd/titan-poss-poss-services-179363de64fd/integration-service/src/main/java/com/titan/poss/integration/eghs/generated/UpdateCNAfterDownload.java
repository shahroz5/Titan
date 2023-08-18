
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
 *         &lt;element name="CNfiscalyear" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CNlocationCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "cNfiscalyear",
    "cNlocationCode"
})
@XmlRootElement(name = "UpdateCNAfterDownload")
public class UpdateCNAfterDownload {

    @XmlElement(name = "CNNo")
    protected int cnNo;
    @XmlElement(name = "CNfiscalyear")
    protected int cNfiscalyear;
    @XmlElement(name = "CNlocationCode")
    protected String cNlocationCode;

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
     * Gets the value of the cNfiscalyear property.
     * 
     */
    public int getCNfiscalyear() {
        return cNfiscalyear;
    }

    /**
     * Sets the value of the cNfiscalyear property.
     * 
     */
    public void setCNfiscalyear(int value) {
        this.cNfiscalyear = value;
    }

    /**
     * Gets the value of the cNlocationCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCNlocationCode() {
        return cNlocationCode;
    }

    /**
     * Sets the value of the cNlocationCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCNlocationCode(String value) {
        this.cNlocationCode = value;
    }

}
