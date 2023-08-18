
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPOSS_GH_PDC_PaymentDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPOSS_GH_PDC_PaymentDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="POSS_GH_PDC_PaymentDO" type="{http://tempuri.org/}POSS_GH_PDC_PaymentDO" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPOSS_GH_PDC_PaymentDO", propOrder = {
    "possghpdcPaymentDO"
})
public class ArrayOfPOSSGHPDCPaymentDO {

    @XmlElement(name = "POSS_GH_PDC_PaymentDO", nillable = true)
    protected List<POSSGHPDCPaymentDO> possghpdcPaymentDO;

    /**
     * Gets the value of the possghpdcPaymentDO property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the possghpdcPaymentDO property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPOSSGHPDCPaymentDO().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link POSSGHPDCPaymentDO }
     * 
     * 
     */
    public List<POSSGHPDCPaymentDO> getPOSSGHPDCPaymentDO() {
        if (possghpdcPaymentDO == null) {
            possghpdcPaymentDO = new ArrayList<POSSGHPDCPaymentDO>();
        }
        return this.possghpdcPaymentDO;
    }

}
