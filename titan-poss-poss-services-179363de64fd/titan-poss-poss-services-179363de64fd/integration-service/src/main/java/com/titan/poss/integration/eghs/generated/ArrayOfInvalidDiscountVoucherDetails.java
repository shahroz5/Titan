
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfInvalidDiscountVoucherDetails complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfInvalidDiscountVoucherDetails"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="InvalidDiscountVoucherDetails" type="{http://tempuri.org/}InvalidDiscountVoucherDetails" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfInvalidDiscountVoucherDetails", propOrder = {
    "invalidDiscountVoucherDetails"
})
public class ArrayOfInvalidDiscountVoucherDetails {

    @XmlElement(name = "InvalidDiscountVoucherDetails", nillable = true)
    protected List<InvalidDiscountVoucherDetails> invalidDiscountVoucherDetails;

    /**
     * Gets the value of the invalidDiscountVoucherDetails property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the invalidDiscountVoucherDetails property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getInvalidDiscountVoucherDetails().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link InvalidDiscountVoucherDetails }
     * 
     * 
     */
    public List<InvalidDiscountVoucherDetails> getInvalidDiscountVoucherDetails() {
        if (invalidDiscountVoucherDetails == null) {
            invalidDiscountVoucherDetails = new ArrayList<InvalidDiscountVoucherDetails>();
        }
        return this.invalidDiscountVoucherDetails;
    }

}
