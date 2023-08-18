
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
 *         &lt;element name="CheckCustomerAteGHSResult" type="{http://tempuri.org/}ArrayOfPOSS_CustomerMaster" minOccurs="0"/&gt;
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
    "checkCustomerAteGHSResult"
})
@XmlRootElement(name = "CheckCustomerAteGHSResponse")
public class CheckCustomerAteGHSResponse {

    @XmlElement(name = "CheckCustomerAteGHSResult")
    protected ArrayOfPOSSCustomerMaster checkCustomerAteGHSResult;

    /**
     * Gets the value of the checkCustomerAteGHSResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfPOSSCustomerMaster }
     *     
     */
    public ArrayOfPOSSCustomerMaster getCheckCustomerAteGHSResult() {
        return checkCustomerAteGHSResult;
    }

    /**
     * Sets the value of the checkCustomerAteGHSResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfPOSSCustomerMaster }
     *     
     */
    public void setCheckCustomerAteGHSResult(ArrayOfPOSSCustomerMaster value) {
        this.checkCustomerAteGHSResult = value;
    }

}
