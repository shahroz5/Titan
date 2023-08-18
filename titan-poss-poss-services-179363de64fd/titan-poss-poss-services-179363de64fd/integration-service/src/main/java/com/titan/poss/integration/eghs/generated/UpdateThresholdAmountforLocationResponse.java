
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
 *         &lt;element name="UpdateThresholdAmountforLocationResult" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "updateThresholdAmountforLocationResult"
})
@XmlRootElement(name = "UpdateThresholdAmountforLocationResponse")
public class UpdateThresholdAmountforLocationResponse {

    @XmlElement(name = "UpdateThresholdAmountforLocationResult")
    protected boolean updateThresholdAmountforLocationResult;

    /**
     * Gets the value of the updateThresholdAmountforLocationResult property.
     * 
     */
    public boolean isUpdateThresholdAmountforLocationResult() {
        return updateThresholdAmountforLocationResult;
    }

    /**
     * Sets the value of the updateThresholdAmountforLocationResult property.
     * 
     */
    public void setUpdateThresholdAmountforLocationResult(boolean value) {
        this.updateThresholdAmountforLocationResult = value;
    }

}
