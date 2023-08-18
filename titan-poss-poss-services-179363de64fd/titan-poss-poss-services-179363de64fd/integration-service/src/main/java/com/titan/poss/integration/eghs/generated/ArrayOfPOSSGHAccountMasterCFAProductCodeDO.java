
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPOSS_GH_Account_Master_CFA_ProductCodeDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPOSS_GH_Account_Master_CFA_ProductCodeDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="POSS_GH_Account_Master_CFA_ProductCodeDO" type="{http://tempuri.org/}POSS_GH_Account_Master_CFA_ProductCodeDO" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPOSS_GH_Account_Master_CFA_ProductCodeDO", propOrder = {
    "possghAccountMasterCFAProductCodeDO"
})
public class ArrayOfPOSSGHAccountMasterCFAProductCodeDO {

    @XmlElement(name = "POSS_GH_Account_Master_CFA_ProductCodeDO", nillable = true)
    protected List<POSSGHAccountMasterCFAProductCodeDO> possghAccountMasterCFAProductCodeDO;

    /**
     * Gets the value of the possghAccountMasterCFAProductCodeDO property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the possghAccountMasterCFAProductCodeDO property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPOSSGHAccountMasterCFAProductCodeDO().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link POSSGHAccountMasterCFAProductCodeDO }
     * 
     * 
     */
    public List<POSSGHAccountMasterCFAProductCodeDO> getPOSSGHAccountMasterCFAProductCodeDO() {
        if (possghAccountMasterCFAProductCodeDO == null) {
            possghAccountMasterCFAProductCodeDO = new ArrayList<POSSGHAccountMasterCFAProductCodeDO>();
        }
        return this.possghAccountMasterCFAProductCodeDO;
    }

}
