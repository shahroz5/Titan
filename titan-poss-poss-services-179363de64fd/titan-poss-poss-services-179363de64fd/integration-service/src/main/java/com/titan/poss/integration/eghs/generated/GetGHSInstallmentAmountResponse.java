
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
 *         &lt;element name="GetGHSInstallmentAmountResult" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
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
    "getGHSInstallmentAmountResult"
})
@XmlRootElement(name = "GetGHSInstallmentAmountResponse")
public class GetGHSInstallmentAmountResponse {

    @XmlElement(name = "GetGHSInstallmentAmountResult")
    protected int getGHSInstallmentAmountResult;

    /**
     * Gets the value of the getGHSInstallmentAmountResult property.
     * 
     */
    public int getGetGHSInstallmentAmountResult() {
        return getGHSInstallmentAmountResult;
    }

    /**
     * Sets the value of the getGHSInstallmentAmountResult property.
     * 
     */
    public void setGetGHSInstallmentAmountResult(int value) {
        this.getGHSInstallmentAmountResult = value;
    }

}
