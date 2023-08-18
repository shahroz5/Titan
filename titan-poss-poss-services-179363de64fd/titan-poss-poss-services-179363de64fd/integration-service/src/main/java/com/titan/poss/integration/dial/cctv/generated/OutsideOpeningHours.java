
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for OutsideOpeningHours.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="OutsideOpeningHours"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="InsideOpeningHours"/&gt;
 *     &lt;enumeration value="OutsideOpeningHours"/&gt;
 *     &lt;enumeration value="PartlyOutsideOpeningHours"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "OutsideOpeningHours", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum OutsideOpeningHours {

    @XmlEnumValue("InsideOpeningHours")
    INSIDE_OPENING_HOURS("InsideOpeningHours"),
    @XmlEnumValue("OutsideOpeningHours")
    OUTSIDE_OPENING_HOURS("OutsideOpeningHours"),
    @XmlEnumValue("PartlyOutsideOpeningHours")
    PARTLY_OUTSIDE_OPENING_HOURS("PartlyOutsideOpeningHours");
    private final String value;

    OutsideOpeningHours(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static OutsideOpeningHours fromValue(String v) {
        for (OutsideOpeningHours c: OutsideOpeningHours.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
