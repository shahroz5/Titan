
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
 *         &lt;element name="CustNo" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CustId" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
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
    "custNo",
    "custId"
})
@XmlRootElement(name = "UpdateCustomerNoFromPOSS")
public class UpdateCustomerNoFromPOSS {

    @XmlElement(name = "CustNo")
    protected int custNo;
    @XmlElement(name = "CustId")
    protected int custId;

    /**
     * Gets the value of the custNo property.
     * 
     */
    public int getCustNo() {
        return custNo;
    }

    /**
     * Sets the value of the custNo property.
     * 
     */
    public void setCustNo(int value) {
        this.custNo = value;
    }

    /**
     * Gets the value of the custId property.
     * 
     */
    public int getCustId() {
        return custId;
    }

    /**
     * Sets the value of the custId property.
     * 
     */
    public void setCustId(int value) {
        this.custId = value;
    }

}
