
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
 *         &lt;element name="BTQEODDoneResult" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "btqeodDoneResult"
})
@XmlRootElement(name = "BTQEODDoneResponse")
public class BTQEODDoneResponse {

    @XmlElement(name = "BTQEODDoneResult")
    protected boolean btqeodDoneResult;

    /**
     * Gets the value of the btqeodDoneResult property.
     * 
     */
    public boolean isBTQEODDoneResult() {
        return btqeodDoneResult;
    }

    /**
     * Sets the value of the btqeodDoneResult property.
     * 
     */
    public void setBTQEODDoneResult(boolean value) {
        this.btqeodDoneResult = value;
    }

}
