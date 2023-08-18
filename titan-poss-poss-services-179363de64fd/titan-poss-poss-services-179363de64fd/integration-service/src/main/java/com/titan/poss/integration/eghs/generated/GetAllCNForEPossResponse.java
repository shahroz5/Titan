
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
 *         &lt;element name="GetAllCNForEPossResult" type="{http://tempuri.org/}ArrayOfPOSS_CreditNoteDO" minOccurs="0"/&gt;
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
    "getAllCNForEPossResult"
})
@XmlRootElement(name = "GetAllCNForEPossResponse")
public class GetAllCNForEPossResponse {

    @XmlElement(name = "GetAllCNForEPossResult")
    protected ArrayOfPOSSCreditNoteDO getAllCNForEPossResult;

    /**
     * Gets the value of the getAllCNForEPossResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfPOSSCreditNoteDO }
     *     
     */
    public ArrayOfPOSSCreditNoteDO getGetAllCNForEPossResult() {
        return getAllCNForEPossResult;
    }

    /**
     * Sets the value of the getAllCNForEPossResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfPOSSCreditNoteDO }
     *     
     */
    public void setGetAllCNForEPossResult(ArrayOfPOSSCreditNoteDO value) {
        this.getAllCNForEPossResult = value;
    }

}
