
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
 *         &lt;element name="UpdatePassbookNumberFromPOSSResult" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "updatePassbookNumberFromPOSSResult"
})
@XmlRootElement(name = "UpdatePassbookNumberFromPOSSResponse")
public class UpdatePassbookNumberFromPOSSResponse {

    @XmlElement(name = "UpdatePassbookNumberFromPOSSResult")
    protected boolean updatePassbookNumberFromPOSSResult;

    /**
     * Gets the value of the updatePassbookNumberFromPOSSResult property.
     * 
     */
    public boolean isUpdatePassbookNumberFromPOSSResult() {
        return updatePassbookNumberFromPOSSResult;
    }

    /**
     * Sets the value of the updatePassbookNumberFromPOSSResult property.
     * 
     */
    public void setUpdatePassbookNumberFromPOSSResult(boolean value) {
        this.updatePassbookNumberFromPOSSResult = value;
    }

}
