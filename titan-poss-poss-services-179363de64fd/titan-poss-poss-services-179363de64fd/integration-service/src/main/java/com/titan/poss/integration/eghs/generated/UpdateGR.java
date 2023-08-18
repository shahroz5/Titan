
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
 *         &lt;element name="objGR" type="{http://tempuri.org/}POSS_BTQGoldPriceMasterDO" minOccurs="0"/&gt;
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
    "objGR"
})
@XmlRootElement(name = "UpdateGR")
public class UpdateGR {

    protected POSSBTQGoldPriceMasterDO objGR;

    /**
     * Gets the value of the objGR property.
     * 
     * @return
     *     possible object is
     *     {@link POSSBTQGoldPriceMasterDO }
     *     
     */
    public POSSBTQGoldPriceMasterDO getObjGR() {
        return objGR;
    }

    /**
     * Sets the value of the objGR property.
     * 
     * @param value
     *     allowed object is
     *     {@link POSSBTQGoldPriceMasterDO }
     *     
     */
    public void setObjGR(POSSBTQGoldPriceMasterDO value) {
        this.objGR = value;
    }

}
