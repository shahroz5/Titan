
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ScanAttribute.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ScanAttribute"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="None"/&gt;
 *     &lt;enumeration value="Auto"/&gt;
 *     &lt;enumeration value="ModifiedUnitPrice"/&gt;
 *     &lt;enumeration value="ManuallyEntered"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ScanAttribute", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum ScanAttribute {

    @XmlEnumValue("None")
    NONE("None"),
    @XmlEnumValue("Auto")
    AUTO("Auto"),
    @XmlEnumValue("ModifiedUnitPrice")
    MODIFIED_UNIT_PRICE("ModifiedUnitPrice"),
    @XmlEnumValue("ManuallyEntered")
    MANUALLY_ENTERED("ManuallyEntered");
    private final String value;

    ScanAttribute(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ScanAttribute fromValue(String v) {
        for (ScanAttribute c: ScanAttribute.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
