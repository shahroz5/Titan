
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPOSS_CreditNoteDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPOSS_CreditNoteDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="POSS_CreditNoteDO" type="{http://tempuri.org/}POSS_CreditNoteDO" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPOSS_CreditNoteDO", propOrder = {
    "possCreditNoteDO"
})
public class ArrayOfPOSSCreditNoteDO {

    @XmlElement(name = "POSS_CreditNoteDO", nillable = true)
    protected List<POSSCreditNoteDO> possCreditNoteDO;

    /**
     * Gets the value of the possCreditNoteDO property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the possCreditNoteDO property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPOSSCreditNoteDO().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link POSSCreditNoteDO }
     * 
     * 
     */
    public List<POSSCreditNoteDO> getPOSSCreditNoteDO() {
        if (possCreditNoteDO == null) {
            possCreditNoteDO = new ArrayList<POSSCreditNoteDO>();
        }
        return this.possCreditNoteDO;
    }

}
