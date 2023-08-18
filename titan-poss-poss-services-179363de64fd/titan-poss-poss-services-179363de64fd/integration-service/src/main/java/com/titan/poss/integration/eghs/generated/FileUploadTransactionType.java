
package com.titan.poss.integration.eghs.generated;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for FileUploadTransactionType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="FileUploadTransactionType"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Unknown"/&gt;
 *     &lt;enumeration value="CreateAccount"/&gt;
 *     &lt;enumeration value="CreateCustomer"/&gt;
 *     &lt;enumeration value="RequestForActivation"/&gt;
 *     &lt;enumeration value="RequestForRefund"/&gt;
 *     &lt;enumeration value="PassBookRequest"/&gt;
 *     &lt;enumeration value="Redemption"/&gt;
 *     &lt;enumeration value="ReverseInstallment"/&gt;
 *     &lt;enumeration value="ChequeBounce"/&gt;
 *     &lt;enumeration value="RequestChangeMaturityBoutique"/&gt;
 *     &lt;enumeration value="ShowRoomCopy"/&gt;
 *     &lt;enumeration value="Refund"/&gt;
 *     &lt;enumeration value="CancelledPassbook"/&gt;
 *     &lt;enumeration value="ApplicationCopy"/&gt;
 *     &lt;enumeration value="CancelledCheque"/&gt;
 *     &lt;enumeration value="ACHMandateForm"/&gt;
 *     &lt;enumeration value="ReProcessRefundAutomation"/&gt;
 *     &lt;enumeration value="CancelledChequeBankPassbook"/&gt;
 *     &lt;enumeration value="AadharCard"/&gt;
 *     &lt;enumeration value="CreateAccountIdProof"/&gt;
 *     &lt;enumeration value="DuplicateSchemeBookOrSmartCardAppCopy"/&gt;
 *     &lt;enumeration value="AadharOtherIDProof"/&gt;
 *     &lt;enumeration value="CustomerAadharCard"/&gt;
 *     &lt;enumeration value="CustomerIDProof"/&gt;
 *     &lt;enumeration value="CustomerAadharOtherIDProof"/&gt;
 *     &lt;enumeration value="CustomerApplicationCopyPDF"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "FileUploadTransactionType")
@XmlEnum
public enum FileUploadTransactionType {

    @XmlEnumValue("Unknown")
    UNKNOWN("Unknown"),
    @XmlEnumValue("CreateAccount")
    CREATE_ACCOUNT("CreateAccount"),
    @XmlEnumValue("CreateCustomer")
    CREATE_CUSTOMER("CreateCustomer"),
    @XmlEnumValue("RequestForActivation")
    REQUEST_FOR_ACTIVATION("RequestForActivation"),
    @XmlEnumValue("RequestForRefund")
    REQUEST_FOR_REFUND("RequestForRefund"),
    @XmlEnumValue("PassBookRequest")
    PASS_BOOK_REQUEST("PassBookRequest"),
    @XmlEnumValue("Redemption")
    REDEMPTION("Redemption"),
    @XmlEnumValue("ReverseInstallment")
    REVERSE_INSTALLMENT("ReverseInstallment"),
    @XmlEnumValue("ChequeBounce")
    CHEQUE_BOUNCE("ChequeBounce"),
    @XmlEnumValue("RequestChangeMaturityBoutique")
    REQUEST_CHANGE_MATURITY_BOUTIQUE("RequestChangeMaturityBoutique"),
    @XmlEnumValue("ShowRoomCopy")
    SHOW_ROOM_COPY("ShowRoomCopy"),
    @XmlEnumValue("Refund")
    REFUND("Refund"),
    @XmlEnumValue("CancelledPassbook")
    CANCELLED_PASSBOOK("CancelledPassbook"),
    @XmlEnumValue("ApplicationCopy")
    APPLICATION_COPY("ApplicationCopy"),
    @XmlEnumValue("CancelledCheque")
    CANCELLED_CHEQUE("CancelledCheque"),
    @XmlEnumValue("ACHMandateForm")
    ACH_MANDATE_FORM("ACHMandateForm"),
    @XmlEnumValue("ReProcessRefundAutomation")
    RE_PROCESS_REFUND_AUTOMATION("ReProcessRefundAutomation"),
    @XmlEnumValue("CancelledChequeBankPassbook")
    CANCELLED_CHEQUE_BANK_PASSBOOK("CancelledChequeBankPassbook"),
    @XmlEnumValue("AadharCard")
    AADHAR_CARD("AadharCard"),
    @XmlEnumValue("CreateAccountIdProof")
    CREATE_ACCOUNT_ID_PROOF("CreateAccountIdProof"),
    @XmlEnumValue("DuplicateSchemeBookOrSmartCardAppCopy")
    DUPLICATE_SCHEME_BOOK_OR_SMART_CARD_APP_COPY("DuplicateSchemeBookOrSmartCardAppCopy"),
    @XmlEnumValue("AadharOtherIDProof")
    AADHAR_OTHER_ID_PROOF("AadharOtherIDProof"),
    @XmlEnumValue("CustomerAadharCard")
    CUSTOMER_AADHAR_CARD("CustomerAadharCard"),
    @XmlEnumValue("CustomerIDProof")
    CUSTOMER_ID_PROOF("CustomerIDProof"),
    @XmlEnumValue("CustomerAadharOtherIDProof")
    CUSTOMER_AADHAR_OTHER_ID_PROOF("CustomerAadharOtherIDProof"),
    @XmlEnumValue("CustomerApplicationCopyPDF")
    CUSTOMER_APPLICATION_COPY_PDF("CustomerApplicationCopyPDF");
    private final String value;

    FileUploadTransactionType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static FileUploadTransactionType fromValue(String v) {
        for (FileUploadTransactionType c: FileUploadTransactionType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
