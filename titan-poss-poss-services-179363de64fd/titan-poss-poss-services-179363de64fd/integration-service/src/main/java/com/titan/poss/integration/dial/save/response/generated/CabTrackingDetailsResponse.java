
package com.titan.poss.integration.dial.save.response.generated;

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
 *         &lt;element name="CabTrackingDetailsResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "cabTrackingDetailsResult"
})
@XmlRootElement(name = "CabTrackingDetailsResponse", namespace = "http://dynamicverticals.com/")
public class CabTrackingDetailsResponse {

    @XmlElement(name = "CabTrackingDetailsResult", namespace = "http://dynamicverticals.com/")
    protected String cabTrackingDetailsResult;

    /**
     * Gets the value of the cabTrackingDetailsResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCabTrackingDetailsResult() {
        return cabTrackingDetailsResult;
    }

    /**
     * Sets the value of the cabTrackingDetailsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCabTrackingDetailsResult(String value) {
        this.cabTrackingDetailsResult = value;
    }

}
