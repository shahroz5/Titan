
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPOSS_CustomerMaster complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPOSS_CustomerMaster"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="POSS_CustomerMaster" type="{http://tempuri.org/}POSS_CustomerMaster" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPOSS_CustomerMaster", propOrder = {
    "possCustomerMaster"
})
public class ArrayOfPOSSCustomerMaster {

    @XmlElement(name = "POSS_CustomerMaster", nillable = true)
    protected List<POSSCustomerMaster> possCustomerMaster;

    /**
     * Gets the value of the possCustomerMaster property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the possCustomerMaster property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPOSSCustomerMaster().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link POSSCustomerMaster }
     * 
     * 
     */
    public List<POSSCustomerMaster> getPOSSCustomerMaster() {
        if (possCustomerMaster == null) {
            possCustomerMaster = new ArrayList<POSSCustomerMaster>();
        }
        return this.possCustomerMaster;
    }

}
