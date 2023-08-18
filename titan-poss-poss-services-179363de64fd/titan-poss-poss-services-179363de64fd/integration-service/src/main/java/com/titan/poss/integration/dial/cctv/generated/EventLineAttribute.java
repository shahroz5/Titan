
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for EventLineAttribute.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="EventLineAttribute"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="None"/&gt;
 *     &lt;enumeration value="TransactionSuspended"/&gt;
 *     &lt;enumeration value="TransactionResumed"/&gt;
 *     &lt;enumeration value="TransactionCancelled"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "EventLineAttribute", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum EventLineAttribute {

    @XmlEnumValue("None")
    NONE("None"),
    @XmlEnumValue("TransactionSuspended")
    TRANSACTION_SUSPENDED("TransactionSuspended"),
    @XmlEnumValue("TransactionResumed")
    TRANSACTION_RESUMED("TransactionResumed"),
    @XmlEnumValue("TransactionCancelled")
    TRANSACTION_CANCELLED("TransactionCancelled");
    private final String value;

    EventLineAttribute(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static EventLineAttribute fromValue(String v) {
        for (EventLineAttribute c: EventLineAttribute.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
