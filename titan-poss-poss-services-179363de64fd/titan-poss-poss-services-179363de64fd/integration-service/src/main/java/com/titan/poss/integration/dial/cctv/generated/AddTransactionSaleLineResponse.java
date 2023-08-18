
package com.titan.poss.integration.dial.cctv.generated;

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
 *         &lt;element name="AddTransactionSaleLineResult" type="{http://schemas.datacontract.org/2004/07/VideoOS.Retail.RetailInputServiceLibrary}TransactionResponseObject" minOccurs="0"/&gt;
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
    "addTransactionSaleLineResult"
})
@XmlRootElement(name = "AddTransactionSaleLineResponse", namespace = "http://tempuri.org/")
public class AddTransactionSaleLineResponse {

    @XmlElement(name = "AddTransactionSaleLineResult", namespace = "http://tempuri.org/", nillable = true)
    protected TransactionResponseObject addTransactionSaleLineResult;

    /**
     * Gets the value of the addTransactionSaleLineResult property.
     * 
     * @return
     *     possible object is
     *     {@link TransactionResponseObject }
     *     
     */
    public TransactionResponseObject getAddTransactionSaleLineResult() {
        return addTransactionSaleLineResult;
    }

    /**
     * Sets the value of the addTransactionSaleLineResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransactionResponseObject }
     *     
     */
    public void setAddTransactionSaleLineResult(TransactionResponseObject value) {
        this.addTransactionSaleLineResult = value;
    }

}
