
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
 *         &lt;element name="SaveTransactionResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "saveTransactionResult"
})
@XmlRootElement(name = "SaveTransactionResponse", namespace = "http://dynamicverticals.com/")
public class SaveTransactionResponse {

    @XmlElement(name = "SaveTransactionResult", namespace = "http://dynamicverticals.com/")
    protected String saveTransactionResult;

    /**
     * Gets the value of the saveTransactionResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSaveTransactionResult() {
        return saveTransactionResult;
    }

    /**
     * Sets the value of the saveTransactionResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSaveTransactionResult(String value) {
        this.saveTransactionResult = value;
    }

}
