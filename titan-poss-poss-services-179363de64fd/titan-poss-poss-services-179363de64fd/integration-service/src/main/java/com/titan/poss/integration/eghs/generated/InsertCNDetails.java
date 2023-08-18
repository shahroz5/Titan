
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
 *         &lt;element name="objCNData" type="{http://tempuri.org/}POSS_CreditNoteDO" minOccurs="0"/&gt;
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
    "objCNData"
})
@XmlRootElement(name = "InsertCNDetails")
public class InsertCNDetails {

    protected POSSCreditNoteDO objCNData;

    /**
     * Gets the value of the objCNData property.
     * 
     * @return
     *     possible object is
     *     {@link POSSCreditNoteDO }
     *     
     */
    public POSSCreditNoteDO getObjCNData() {
        return objCNData;
    }

    /**
     * Sets the value of the objCNData property.
     * 
     * @param value
     *     allowed object is
     *     {@link POSSCreditNoteDO }
     *     
     */
    public void setObjCNData(POSSCreditNoteDO value) {
        this.objCNData = value;
    }

}
