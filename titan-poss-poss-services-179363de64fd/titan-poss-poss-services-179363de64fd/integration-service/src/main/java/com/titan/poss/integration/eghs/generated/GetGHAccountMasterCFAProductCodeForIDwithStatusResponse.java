
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
 *         &lt;element name="GetGH_Account_Master_CFA_ProductCode_ForIDwithStatusResult" type="{http://tempuri.org/}ArrayOfPOSS_GH_Account_Master_CFA_ProductCodeDO" minOccurs="0"/&gt;
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
    "getGHAccountMasterCFAProductCodeForIDwithStatusResult"
})
@XmlRootElement(name = "GetGH_Account_Master_CFA_ProductCode_ForIDwithStatusResponse")
public class GetGHAccountMasterCFAProductCodeForIDwithStatusResponse {

    @XmlElement(name = "GetGH_Account_Master_CFA_ProductCode_ForIDwithStatusResult")
    protected ArrayOfPOSSGHAccountMasterCFAProductCodeDO getGHAccountMasterCFAProductCodeForIDwithStatusResult;

    /**
     * Gets the value of the getGHAccountMasterCFAProductCodeForIDwithStatusResult property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfPOSSGHAccountMasterCFAProductCodeDO }
     *     
     */
    public ArrayOfPOSSGHAccountMasterCFAProductCodeDO getGetGHAccountMasterCFAProductCodeForIDwithStatusResult() {
        return getGHAccountMasterCFAProductCodeForIDwithStatusResult;
    }

    /**
     * Sets the value of the getGHAccountMasterCFAProductCodeForIDwithStatusResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfPOSSGHAccountMasterCFAProductCodeDO }
     *     
     */
    public void setGetGHAccountMasterCFAProductCodeForIDwithStatusResult(ArrayOfPOSSGHAccountMasterCFAProductCodeDO value) {
        this.getGHAccountMasterCFAProductCodeForIDwithStatusResult = value;
    }

}
