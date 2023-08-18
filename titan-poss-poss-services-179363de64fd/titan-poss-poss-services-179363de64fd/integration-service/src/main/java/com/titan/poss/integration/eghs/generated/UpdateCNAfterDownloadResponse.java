
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
 *         &lt;element name="UpdateCNAfterDownloadResult" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "updateCNAfterDownloadResult"
})
@XmlRootElement(name = "UpdateCNAfterDownloadResponse")
public class UpdateCNAfterDownloadResponse {

    @XmlElement(name = "UpdateCNAfterDownloadResult")
    protected boolean updateCNAfterDownloadResult;

    /**
     * Gets the value of the updateCNAfterDownloadResult property.
     * 
     */
    public boolean isUpdateCNAfterDownloadResult() {
        return updateCNAfterDownloadResult;
    }

    /**
     * Sets the value of the updateCNAfterDownloadResult property.
     * 
     */
    public void setUpdateCNAfterDownloadResult(boolean value) {
        this.updateCNAfterDownloadResult = value;
    }

}
