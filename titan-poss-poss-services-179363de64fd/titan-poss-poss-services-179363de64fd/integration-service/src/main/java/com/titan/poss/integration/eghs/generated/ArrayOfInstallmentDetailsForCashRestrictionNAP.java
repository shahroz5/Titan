
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfInstallmentDetailsForCashRestrictionNAP complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfInstallmentDetailsForCashRestrictionNAP"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="InstallmentDetailsForCashRestrictionNAP" type="{http://tempuri.org/}InstallmentDetailsForCashRestrictionNAP" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfInstallmentDetailsForCashRestrictionNAP", propOrder = {
    "installmentDetailsForCashRestrictionNAP"
})
public class ArrayOfInstallmentDetailsForCashRestrictionNAP {

    @XmlElement(name = "InstallmentDetailsForCashRestrictionNAP", nillable = true)
    protected List<InstallmentDetailsForCashRestrictionNAP> installmentDetailsForCashRestrictionNAP;

    /**
     * Gets the value of the installmentDetailsForCashRestrictionNAP property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the installmentDetailsForCashRestrictionNAP property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getInstallmentDetailsForCashRestrictionNAP().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link InstallmentDetailsForCashRestrictionNAP }
     * 
     * 
     */
    public List<InstallmentDetailsForCashRestrictionNAP> getInstallmentDetailsForCashRestrictionNAP() {
        if (installmentDetailsForCashRestrictionNAP == null) {
            installmentDetailsForCashRestrictionNAP = new ArrayList<InstallmentDetailsForCashRestrictionNAP>();
        }
        return this.installmentDetailsForCashRestrictionNAP;
    }

}
