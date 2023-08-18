
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TransactionType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TransactionType"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="CompletedNormally"/&gt;
 *     &lt;enumeration value="Suspended"/&gt;
 *     &lt;enumeration value="Cancelled"/&gt;
 *     &lt;enumeration value="CancellationOfPrevious"/&gt;
 *     &lt;enumeration value="OperatorSignOn"/&gt;
 *     &lt;enumeration value="OperatorSignOff"/&gt;
 *     &lt;enumeration value="DrawerOpenedOutsideATransaction"/&gt;
 *     &lt;enumeration value="CashStatement"/&gt;
 *     &lt;enumeration value="SurpriseTillCashCounts"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "TransactionType", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum TransactionType {

    @XmlEnumValue("CompletedNormally")
    COMPLETED_NORMALLY("CompletedNormally"),
    @XmlEnumValue("Suspended")
    SUSPENDED("Suspended"),
    @XmlEnumValue("Cancelled")
    CANCELLED("Cancelled"),
    @XmlEnumValue("CancellationOfPrevious")
    CANCELLATION_OF_PREVIOUS("CancellationOfPrevious"),
    @XmlEnumValue("OperatorSignOn")
    OPERATOR_SIGN_ON("OperatorSignOn"),
    @XmlEnumValue("OperatorSignOff")
    OPERATOR_SIGN_OFF("OperatorSignOff"),
    @XmlEnumValue("DrawerOpenedOutsideATransaction")
    DRAWER_OPENED_OUTSIDE_A_TRANSACTION("DrawerOpenedOutsideATransaction"),
    @XmlEnumValue("CashStatement")
    CASH_STATEMENT("CashStatement"),
    @XmlEnumValue("SurpriseTillCashCounts")
    SURPRISE_TILL_CASH_COUNTS("SurpriseTillCashCounts");
    private final String value;

    TransactionType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TransactionType fromValue(String v) {
        for (TransactionType c: TransactionType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
