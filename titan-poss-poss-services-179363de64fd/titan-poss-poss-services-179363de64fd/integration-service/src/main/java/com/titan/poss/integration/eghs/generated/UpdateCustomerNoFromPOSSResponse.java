
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
 *         &lt;element name="UpdateCustomerNoFromPOSSResult" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "updateCustomerNoFromPOSSResult"
})
@XmlRootElement(name = "UpdateCustomerNoFromPOSSResponse")
public class UpdateCustomerNoFromPOSSResponse {

    @XmlElement(name = "UpdateCustomerNoFromPOSSResult")
    protected boolean updateCustomerNoFromPOSSResult;

    /**
     * Gets the value of the updateCustomerNoFromPOSSResult property.
     * 
     */
    public boolean isUpdateCustomerNoFromPOSSResult() {
        return updateCustomerNoFromPOSSResult;
    }

    /**
     * Sets the value of the updateCustomerNoFromPOSSResult property.
     * 
     */
    public void setUpdateCustomerNoFromPOSSResult(boolean value) {
        this.updateCustomerNoFromPOSSResult = value;
    }

}
