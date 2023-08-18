
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfGHTodaysRevenue complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfGHTodaysRevenue"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="GHTodaysRevenue" type="{http://tempuri.org/}GHTodaysRevenue" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfGHTodaysRevenue", propOrder = {
    "ghTodaysRevenue"
})
public class ArrayOfGHTodaysRevenue {

    @XmlElement(name = "GHTodaysRevenue", nillable = true)
    protected List<GHTodaysRevenue> ghTodaysRevenue;

    /**
     * Gets the value of the ghTodaysRevenue property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the ghTodaysRevenue property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getGHTodaysRevenue().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link GHTodaysRevenue }
     * 
     * 
     */
    public List<GHTodaysRevenue> getGHTodaysRevenue() {
        if (ghTodaysRevenue == null) {
            ghTodaysRevenue = new ArrayList<GHTodaysRevenue>();
        }
        return this.ghTodaysRevenue;
    }

}
