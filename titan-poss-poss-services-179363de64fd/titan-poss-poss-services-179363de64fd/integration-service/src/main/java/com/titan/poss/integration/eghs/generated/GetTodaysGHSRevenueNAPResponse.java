
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
 *         &lt;element name="GetTodaysGHSRevenue_NAPResult" type="{http://tempuri.org/}ArrayOfGHTodaysRevenue" minOccurs="0"/&gt;
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
    "getTodaysGHSRevenueNAPResult"
})
@XmlRootElement(name = "GetTodaysGHSRevenue_NAPResponse")
public class GetTodaysGHSRevenueNAPResponse {

    @XmlElement(name = "GetTodaysGHSRevenue_NAPResult")
    protected ArrayOfGHTodaysRevenue getTodaysGHSRevenueNAPResult;

    /**
     * Gets the value of the getTodaysGHSRevenueNAPResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfGHTodaysRevenue }
     *     
     */
    public ArrayOfGHTodaysRevenue getGetTodaysGHSRevenueNAPResult() {
        return getTodaysGHSRevenueNAPResult;
    }

    /**
     * Sets the value of the getTodaysGHSRevenueNAPResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfGHTodaysRevenue }
     *     
     */
    public void setGetTodaysGHSRevenueNAPResult(ArrayOfGHTodaysRevenue value) {
        this.getTodaysGHSRevenueNAPResult = value;
    }

}
