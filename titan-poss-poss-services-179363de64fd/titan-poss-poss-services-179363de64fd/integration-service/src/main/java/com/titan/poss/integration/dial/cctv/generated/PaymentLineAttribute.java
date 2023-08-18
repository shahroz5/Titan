
package com.titan.poss.integration.dial.cctv.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PaymentLineAttribute.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="PaymentLineAttribute"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="None"/&gt;
 *     &lt;enumeration value="Cash"/&gt;
 *     &lt;enumeration value="CreditCard"/&gt;
 *     &lt;enumeration value="GiftCard"/&gt;
 *     &lt;enumeration value="InternalShopVoucher"/&gt;
 *     &lt;enumeration value="BankVoucher"/&gt;
 *     &lt;enumeration value="AccountSale"/&gt;
 *     &lt;enumeration value="ReturnCash"/&gt;
 *     &lt;enumeration value="FractionRounding"/&gt;
 *     &lt;enumeration value="PurchaseOrder"/&gt;
 *     &lt;enumeration value="CreditNoteIssued"/&gt;
 *     &lt;enumeration value="CreditNotePayment"/&gt;
 *     &lt;enumeration value="LoyaltyCard"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "PaymentLineAttribute", namespace = "http://schemas.datacontract.org/2004/07/VideoOS.Retail")
@XmlEnum
public enum PaymentLineAttribute {

    @XmlEnumValue("None")
    NONE("None"),
    @XmlEnumValue("Cash")
    CASH("Cash"),
    @XmlEnumValue("CreditCard")
    CREDIT_CARD("CreditCard"),
    @XmlEnumValue("GiftCard")
    GIFT_CARD("GiftCard"),
    @XmlEnumValue("InternalShopVoucher")
    INTERNAL_SHOP_VOUCHER("InternalShopVoucher"),
    @XmlEnumValue("BankVoucher")
    BANK_VOUCHER("BankVoucher"),
    @XmlEnumValue("AccountSale")
    ACCOUNT_SALE("AccountSale"),
    @XmlEnumValue("ReturnCash")
    RETURN_CASH("ReturnCash"),
    @XmlEnumValue("FractionRounding")
    FRACTION_ROUNDING("FractionRounding"),
    @XmlEnumValue("PurchaseOrder")
    PURCHASE_ORDER("PurchaseOrder"),
    @XmlEnumValue("CreditNoteIssued")
    CREDIT_NOTE_ISSUED("CreditNoteIssued"),
    @XmlEnumValue("CreditNotePayment")
    CREDIT_NOTE_PAYMENT("CreditNotePayment"),
    @XmlEnumValue("LoyaltyCard")
    LOYALTY_CARD("LoyaltyCard");
    private final String value;

    PaymentLineAttribute(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static PaymentLineAttribute fromValue(String v) {
        for (PaymentLineAttribute c: PaymentLineAttribute.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
