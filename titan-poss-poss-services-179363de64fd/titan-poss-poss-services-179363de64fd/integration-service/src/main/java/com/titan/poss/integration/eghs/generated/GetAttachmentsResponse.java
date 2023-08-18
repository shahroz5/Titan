
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
 *         &lt;element name="GetAttachmentsResult" type="{http://tempuri.org/}ArrayOfPOSS_Attachment" minOccurs="0"/&gt;
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
    "getAttachmentsResult"
})
@XmlRootElement(name = "GetAttachmentsResponse")
public class GetAttachmentsResponse {

    @XmlElement(name = "GetAttachmentsResult")
    protected ArrayOfPOSSAttachment getAttachmentsResult;

    /**
     * Gets the value of the getAttachmentsResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfPOSSAttachment }
     *     
     */
    public ArrayOfPOSSAttachment getGetAttachmentsResult() {
        return getAttachmentsResult;
    }

    /**
     * Sets the value of the getAttachmentsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfPOSSAttachment }
     *     
     */
    public void setGetAttachmentsResult(ArrayOfPOSSAttachment value) {
        this.getAttachmentsResult = value;
    }

}
