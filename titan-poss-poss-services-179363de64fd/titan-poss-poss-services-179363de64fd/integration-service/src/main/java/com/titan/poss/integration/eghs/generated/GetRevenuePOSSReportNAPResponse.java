
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
 *         &lt;element name="GetRevenuePOSSReport_NAPResult" type="{http://tempuri.org/}ArrayOfGHRevenueDetail" minOccurs="0"/&gt;
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
    "getRevenuePOSSReportNAPResult"
})
@XmlRootElement(name = "GetRevenuePOSSReport_NAPResponse")
public class GetRevenuePOSSReportNAPResponse {

    @XmlElement(name = "GetRevenuePOSSReport_NAPResult")
    protected ArrayOfGHRevenueDetail getRevenuePOSSReportNAPResult;

    /**
     * Gets the value of the getRevenuePOSSReportNAPResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfGHRevenueDetail }
     *     
     */
    public ArrayOfGHRevenueDetail getGetRevenuePOSSReportNAPResult() {
        return getRevenuePOSSReportNAPResult;
    }

    /**
     * Sets the value of the getRevenuePOSSReportNAPResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfGHRevenueDetail }
     *     
     */
    public void setGetRevenuePOSSReportNAPResult(ArrayOfGHRevenueDetail value) {
        this.getRevenuePOSSReportNAPResult = value;
    }

}
