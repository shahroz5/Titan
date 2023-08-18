
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
 *         &lt;element name="DownloadCreditNotesForReconciliationResult" type="{http://tempuri.org/}ArrayOfPOSS_CreditNoteDO" minOccurs="0"/&gt;
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
    "downloadCreditNotesForReconciliationResult"
})
@XmlRootElement(name = "DownloadCreditNotesForReconciliationResponse")
public class DownloadCreditNotesForReconciliationResponse {

    @XmlElement(name = "DownloadCreditNotesForReconciliationResult")
    protected ArrayOfPOSSCreditNoteDO downloadCreditNotesForReconciliationResult;

    /**
     * Gets the value of the downloadCreditNotesForReconciliationResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfPOSSCreditNoteDO }
     *     
     */
    public ArrayOfPOSSCreditNoteDO getDownloadCreditNotesForReconciliationResult() {
        return downloadCreditNotesForReconciliationResult;
    }

    /**
     * Sets the value of the downloadCreditNotesForReconciliationResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfPOSSCreditNoteDO }
     *     
     */
    public void setDownloadCreditNotesForReconciliationResult(ArrayOfPOSSCreditNoteDO value) {
        this.downloadCreditNotesForReconciliationResult = value;
    }

}
