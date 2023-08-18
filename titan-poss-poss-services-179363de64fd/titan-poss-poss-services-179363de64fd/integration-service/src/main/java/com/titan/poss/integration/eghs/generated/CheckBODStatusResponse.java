
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
 *         &lt;element name="CheckBODStatusResult" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "checkBODStatusResult"
})
@XmlRootElement(name = "CheckBODStatusResponse")
public class CheckBODStatusResponse {

    @XmlElement(name = "CheckBODStatusResult")
    protected boolean checkBODStatusResult;

    /**
     * Gets the value of the checkBODStatusResult property.
     * 
     */
    public boolean isCheckBODStatusResult() {
        return checkBODStatusResult;
    }

    /**
     * Sets the value of the checkBODStatusResult property.
     * 
     */
    public void setCheckBODStatusResult(boolean value) {
        this.checkBODStatusResult = value;
    }

}
