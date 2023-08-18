
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SaleLineAttribute.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SaleLineAttribute"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="None"/&gt;
 *     &lt;enumeration value="ExchangeSlipWithoutMatchingLine"/&gt;
 *     &lt;enumeration value="BackorderItem"/&gt;
 *     &lt;enumeration value="VoidedBackorderItem"/&gt;
 *     &lt;enumeration value="ReturnItem"/&gt;
 *     &lt;enumeration value="CancellationWithinTransaction"/&gt;
 *     &lt;enumeration value="GiftCard"/&gt;
 *     &lt;enumeration value="ExchangeSlip"/&gt;
 *     &lt;enumeration value="ReturnNotRecentlySold"/&gt;
 *     &lt;enumeration value="Reserved"/&gt;
 *     &lt;enumeration value="FastMovingItem"/&gt;
 *     &lt;enumeration value="BulkPurchase"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "SaleLineAttribute", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum SaleLineAttribute {

    @XmlEnumValue("None")
    NONE("None"),
    @XmlEnumValue("ExchangeSlipWithoutMatchingLine")
    EXCHANGE_SLIP_WITHOUT_MATCHING_LINE("ExchangeSlipWithoutMatchingLine"),
    @XmlEnumValue("BackorderItem")
    BACKORDER_ITEM("BackorderItem"),
    @XmlEnumValue("VoidedBackorderItem")
    VOIDED_BACKORDER_ITEM("VoidedBackorderItem"),
    @XmlEnumValue("ReturnItem")
    RETURN_ITEM("ReturnItem"),
    @XmlEnumValue("CancellationWithinTransaction")
    CANCELLATION_WITHIN_TRANSACTION("CancellationWithinTransaction"),
    @XmlEnumValue("GiftCard")
    GIFT_CARD("GiftCard"),
    @XmlEnumValue("ExchangeSlip")
    EXCHANGE_SLIP("ExchangeSlip"),
    @XmlEnumValue("ReturnNotRecentlySold")
    RETURN_NOT_RECENTLY_SOLD("ReturnNotRecentlySold"),
    @XmlEnumValue("Reserved")
    RESERVED("Reserved"),
    @XmlEnumValue("FastMovingItem")
    FAST_MOVING_ITEM("FastMovingItem"),
    @XmlEnumValue("BulkPurchase")
    BULK_PURCHASE("BulkPurchase");
    private final String value;

    SaleLineAttribute(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static SaleLineAttribute fromValue(String v) {
        for (SaleLineAttribute c: SaleLineAttribute.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
