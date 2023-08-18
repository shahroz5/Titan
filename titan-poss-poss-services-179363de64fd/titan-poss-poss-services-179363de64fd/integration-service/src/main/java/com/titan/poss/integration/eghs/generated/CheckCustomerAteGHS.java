
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
 *         &lt;element name="objCustDetails" type="{http://tempuri.org/}POSS_CustomerMaster" minOccurs="0"/&gt;
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
    "objCustDetails"
})
@XmlRootElement(name = "CheckCustomerAteGHS")
public class CheckCustomerAteGHS {

    protected POSSCustomerMaster objCustDetails;

    /**
     * Gets the value of the objCustDetails property.
     * 
     * @return
     *     possible object is
     *     {@link POSSCustomerMaster }
     *     
     */
    public POSSCustomerMaster getObjCustDetails() {
        return objCustDetails;
    }

    /**
     * Sets the value of the objCustDetails property.
     * 
     * @param value
     *     allowed object is
     *     {@link POSSCustomerMaster }
     *     
     */
    public void setObjCustDetails(POSSCustomerMaster value) {
        this.objCustDetails = value;
    }

}
