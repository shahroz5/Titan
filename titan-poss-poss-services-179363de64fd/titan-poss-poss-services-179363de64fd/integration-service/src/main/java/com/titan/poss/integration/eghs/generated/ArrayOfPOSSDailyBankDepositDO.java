
package com.titan.poss.integration.eghs.generated;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPOSS_DailyBankDepositDO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPOSS_DailyBankDepositDO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="POSS_DailyBankDepositDO" type="{http://tempuri.org/}POSS_DailyBankDepositDO" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPOSS_DailyBankDepositDO", propOrder = {
    "possDailyBankDepositDO"
})
public class ArrayOfPOSSDailyBankDepositDO {

    @XmlElement(name = "POSS_DailyBankDepositDO", nillable = true)
    protected List<POSSDailyBankDepositDO> possDailyBankDepositDO;

    /**
     * Gets the value of the possDailyBankDepositDO property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the possDailyBankDepositDO property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPOSSDailyBankDepositDO().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link POSSDailyBankDepositDO }
     * 
     * 
     */
    public List<POSSDailyBankDepositDO> getPOSSDailyBankDepositDO() {
        if (possDailyBankDepositDO == null) {
            possDailyBankDepositDO = new ArrayList<POSSDailyBankDepositDO>();
        }
        return this.possDailyBankDepositDO;
    }

}
