
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TotalLineAttribute.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TotalLineAttribute"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="None"/&gt;
 *     &lt;enumeration value="SubTotal"/&gt;
 *     &lt;enumeration value="VAT"/&gt;
 *     &lt;enumeration value="FinalDiscountLess"/&gt;
 *     &lt;enumeration value="DiscountIncludedInTotalAmount"/&gt;
 *     &lt;enumeration value="LoyalityCardDiscount"/&gt;
 *     &lt;enumeration value="TotalAmountToBePaid"/&gt;
 *     &lt;enumeration value="TotalDiscount"/&gt;
 *     &lt;enumeration value="TotalEmployeeDiscount"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "TotalLineAttribute", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum TotalLineAttribute {

    @XmlEnumValue("None")
    NONE("None"),
    @XmlEnumValue("SubTotal")
    SUB_TOTAL("SubTotal"),
    VAT("VAT"),
    @XmlEnumValue("FinalDiscountLess")
    FINAL_DISCOUNT_LESS("FinalDiscountLess"),
    @XmlEnumValue("DiscountIncludedInTotalAmount")
    DISCOUNT_INCLUDED_IN_TOTAL_AMOUNT("DiscountIncludedInTotalAmount"),
    @XmlEnumValue("LoyalityCardDiscount")
    LOYALITY_CARD_DISCOUNT("LoyalityCardDiscount"),
    @XmlEnumValue("TotalAmountToBePaid")
    TOTAL_AMOUNT_TO_BE_PAID("TotalAmountToBePaid"),
    @XmlEnumValue("TotalDiscount")
    TOTAL_DISCOUNT("TotalDiscount"),
    @XmlEnumValue("TotalEmployeeDiscount")
    TOTAL_EMPLOYEE_DISCOUNT("TotalEmployeeDiscount");
    private final String value;

    TotalLineAttribute(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TotalLineAttribute fromValue(String v) {
        for (TotalLineAttribute c: TotalLineAttribute.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
