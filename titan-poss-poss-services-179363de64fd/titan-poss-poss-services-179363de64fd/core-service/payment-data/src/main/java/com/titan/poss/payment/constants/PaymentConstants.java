/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class PaymentConstants {

	/**
	 * Transaction LOVs Constants.
	 */

	public static final String LOV_CONTROLLER = "PaymentLovController";
	public static final String LOV_SERVICE = "LovService";
	public static final String LOV_SERVICE_IMPL = "LovServiceImpl";
	public static final String LOV_REPOSITORY = "PaymentLovRepository";

	/**
	 * Payment Master Constants
	 */

	public static final String PAYMENT_CONTROLLER = "PaymentController";
	public static final String PAYMENT_SERVICE = "PaymentService";
	public static final String PAYMENT_SERVICE_IMPL = "PaymentServiceImpl";
	public static final String PAYMENT_REPOSITORY = "PaymentRepository";

	/**
	 * Payer Bank Master
	 */

	public static final String PAYER_BANK_CONTROLLER = "PayerBankController";
	public static final String PAYER_BANK_SERVICE = "PayerBankService";
	public static final String PAYER_BANK_SERVICE_IMPL = "PayerBankServiceImpl";
	public static final String PAYER_BANK_REPOSITORY = "PayerBankRepository";
	public static final String PAYER_BANK_CONFIG_CONTROLLER = "PayerBankConfigController";
	public static final String PAYER_BANK_CONFIG_SERVICE = "PayerBankConfigService";
	public static final String PAYER_BANK_CONFIG_SERVICE_IMPL = "PayerBankConfigServiceImpl";
	public static final String PAYER_BANK_CONFIG_REPOSITORY = "PayerBankConfigRepository";
	public static final String PAYER_BANK_DETAILS_REPOSITORY = "PayerBankDetailsRepository";
	public static final String PAYER_BANK_LOCATION_MAPPING_REPOSITORY = "PayerBankLocationMappingRepository";
	public static final String PAYER_BANK_LOCATION_REPOSITORY = "PayerBankLocationMappingRepository";

	/**
	 * Payer Bank Master
	 */

	public static final String PAYEE_BANK_CONTROLLER = "PayeeBankController";
	public static final String PAYEE_BANK_SERVICE = "PayeeBankService";
	public static final String PAYEE_BANK_SERVICE_IMPL = "PayeeBankServiceImpl";
	public static final String PAYEE_BANK_REPOSITORY = "PayeeBankRepository";

	/* GL Code Master and Location Payment Mapping */

	public static final String PAYMENT_GL_CODE_CONTROLLER = "PaymentGlCodeController";
	public static final String PAYMENT_GL_CODE_SERVICE = "PaymentGlCodeService";
	public static final String PAYMENT_GL_CODE_SERVICE_IMPL = "PaymentGlCodeServiceImpl";
	public static final String PAYMENT_GL_CODE_REPOSITORY = "PaymentGlCodeRepository";
	public static final String PAYMENT_GL_CODE_MAPPING_REPOSITORY = "PaymentGlCodeMappingRepository";

	/**
	 * Payment Config Master and Location Mapping
	 */

	public static final String PAYMENT_CONFIG_CONTROLLER = "PaymentConfigController";
	public static final String PAYMENT_CONFIG_SERVICE = "PaymentConfigService";
	public static final String PAYMENT_CONFIG_SERVICE_IMPL = "PaymentConfigServiceImpl";
	public static final String PAYMENT_CONFIG_REPOSITORY = "PaymentConfigRepository";
	public static final String CONFIG_DETAILS_REPOSITORY = "PaymentConfigDetailsRepository";
	public static final String CONFIG_LOCATION_REPOSITORY = "ConfigLocationMappingRepository";
	public static final String PAYMENT_CUSTOMER_REPOSITORY = "PaymentCustomerMappingRepository";

	/* Common Constants */

	public static final String PIPE = "|";
	public static final String TIMESTAMP = "timestamp";
	public static final String DATE_FORMAT = "dd-MM-yyyy-HH-mm-ss";
	public static final String INVALID_DESCRIPTION = "Invalid Description";
	public static final String INVALID_PAYMENT_CODE = "Invalid Payment Code";
	public static final String INVALID_BANK_NAME = "Invalid Bank Name";
	public static final String PAYMENT_UTIL_SERVICE = "PaymentUtilService";
	public static final String INVALID_TRANSACTION_TYPE = "Invalid Transaction Type";
	public static final String INVALID_GIFT_VOUCHER_STATUS = "Invalid gift voucher";
	public static final String INVALID_GIFT_VOUCHER = "This gift voucher is not applicable";
	public static final String INVALID_STATUS_TO_UPDATE = "Can't update the status";
	public static final String INVALID_DATE_TO_UPDATE = "Invalid DATE";
	public static final String INVALID_GIFT_VOUCHER_SERIAL_NO = "NO Data found for requested Serial Numbers";
	public static final String PAYMENT_UTIL_SERVICE_IMPL = "PaymentUtilServiceImpl";
	public static final String INVALID_SERIAL_NO = "Invalid serial No";
	public static final String INVALID_RANGE_SERIAL_NO = "Serial Number Range is Invalid";
	/**
	 * Payment Category Constants
	 */

	public static final String PAYMENT_CATEGORY_CONTROLLER = "GiftCardController";
	public static final String PAYMENT_CATEGORY_SERVICE_IMPL = "GiftCardServiceImpl";
	public static final String PAYMENT_CATEGORY_REPOSITORY = "GiftCardRepository";
	public static final String PAYMENT_CATEGORY_PRODUCT_REPOSITORY = "GiftCardProductRepository";

	/**
	 * Payment Hostname
	 */
	public static final String PAYMENT_HOSTNAME_CONTROLLER = "PaymentHostnameController";
	public static final String PAYMENT_HOSTNAME_SERVICE_IMPL = "PaymentHostnameService";
	public static final String PAYMENT_HOSTNAME_REPOSITORY = "PaymentHostnameRepository";

	/**
	 * Error Constants
	 */

	public static final String ERR_PAY_001 = "ERR-PAY-001";
	public static final String ERR_PAY_002 = "ERR-PAY-002";
	public static final String ERR_PAY_003 = "ERR-PAY-003";
	public static final String ERR_PAY_004 = "ERR-PAY-004";
	public static final String ERR_PAY_005 = "ERR-PAY-005";
	public static final String ERR_PAY_006 = "ERR-PAY-006";
	public static final String ERR_PAY_007 = "ERR-PAY-007";
	public static final String ERR_PAY_008 = "ERR-PAY-008";
	public static final String ERR_PAY_009 = "ERR-PAY-009";
	public static final String ERR_PAY_010 = "ERR-PAY-010";
	public static final String ERR_PAY_011 = "ERR-PAY-011";
	public static final String ERR_PAY_012 = "ERR-PAY-012";
	public static final String ERR_PAY_013 = "ERR-PAY-013";
	public static final String ERR_LOC_016 = "ERR-LOC-016";
	public static final String ERR_PAY_017 = "ERR-PAY-017";
	public static final String ERR_PAY_018 = "ERR-PAY-018";
	public static final String ERR_PAY_019 = "ERR-PAY-019";
	public static final String ERR_PAY_020 = "ERR-PAY-020";
	public static final String ERR_PAY_021 = "ERR-PAY-021";
	public static final String ERR_PAY_022 = "ERR-PAY-022";
	public static final String NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED = "No Configuration for the requested PaymentCode";
	public static final String NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_LOCATION = "No Configuration Found for the requested location code";
	public static final String CONFIGURATION_IS_ALREADY_PRESENT = "Configuration is Already Present";
	public static final String NO_MAPPING_FOUND = "No Payment Category product mappings found";
	public static final String NO_GIFT_CARD_FOUND = "No gift card found for the requested gift card";
	public static final String GIFT_CARD_ALREADY_PRESENT = "Gift Card is already Present";
	public static final String PAYMENT_CODE_IS_ALREADY_CONFIGURED = "Requested Payment Code is already Configured in another Bank for same location";
	public static final String PAYMENT_CODE_IS_ALREADY_AVAILABLE = "Payment Code is already available";
	public static final String BANK_NAME_IS_ALREADY_AVAILABLE = "Bank Name is already available";
	public static final String LOV_TYPE_AND_CODE_IS_ALREADY_AVAILABLE = "LovType and code is already available";
	public static final String NO_PAYMENT_FOUND_FOR_THE_REQUESTED_PAYMENT_CODE = "No Payment found for the requested PaymentCode";
	public static final String NO_BANK_FOUND_FOR_THE_REQUESTED_BANK_NAME = "No Bank Details found for the requested Bank Name";
	public static final String REQUESTED_LOCATION_CONFIGURATION_ALREADY_PRESENT = "Config Id location Configuration already presnet for Some location";
	public static final String NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT = "No Payment Configuration found for the requested Payment Config";

	/**
	 * CashbackOffer Error Constants
	 */
	public static final String ERR_PAY_031 = "ERR-PAY-031";
	public static final String ERR_PAY_032 = "ERR-PAY-032";
	public static final String ERR_PAY_033 = "ERR-PAY-033";
	public static final String ERR_PAY_034 = "ERR-PAY-034";
	public static final String ERR_PAY_035 = "ERR-PAY-035";
	public static final String ERR_PAY_036 = "ERR-PAY-036";
	public static final String ERR_PAY_037 = "ERR-PAY-037";
	public static final String ERR_PAY_038 = "ERR-PAY-038";
	public static final String ERR_PAY_039 = "ERR-PAY-039";
	public static final String ERR_PAY_040 = "ERR-PAY-040";
	public static final String ERR_PAY_041 = "ERR-PAY-041";
	public static final String ERR_PAY_042 = "ERR-PAY-042";
	public static final String NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_CASHBACK_ID = "No Configuration Found for the requested Cashback Id";
	public static final String NO_PRODUCT_MAPPING_FOUND_FOR_REQUESTED_ID = "No Product Mapping Found for the requested cashbackId";
	public static final String NO_OFFER_MAPPED_FOR_REQUESTED_ID = "No Offer is mapped for the requested cashbackId";
	public static final String NO_CARD_DETAILS_FOUND_FOR_REQUESTED_ID = "No CardDetails Found for the requested Id";
	public static final String NO_OFFER_DETAILS_FOUND_FOR_REQUESTED_ID = "No OfferDetails Found for the requested Id";

	public static final String UNABLE_TO_DELETE_THE_FILE = "Unable to delete the file - {}";
	public static final String UNABLE_TO_SAVE_FILE = "Unable to save file";
	public static final String FILE_READER_METHOD_INVOKE_FAILED = "Error in reading CSV file";
	public static final String FAILED = "FAILED";
	public static final String VALIDATION_FAILED = "Validation Failed";
	public static final String FILE_READER_METHOD_INVOKED_SUCCESSFULLY = "Card details file reader method invoked Successfully";
	public static final String CASHBACK_ID_NOT_PRESENT = "No CashbackId Present";
	public static final String CASHBACK_WITH_BANK_NOT_PRESENT = "Bank doesnt have Cashback Offer";
	public static final String CASHBACK_NOT_PRESENT_FOR_CARD_NUMBER = "No Cashback Offer for the given Card Number";
	public static final String CASHBACK_OFFER_DETAILS_NOT_PRESENT_FOR_CARD_NUMBER = "No Cashback Offer Details Configured for the given CardNumber and CashbackId";

	/**
	 * CashBackOffer Constants
	 */

	public static final String CASHBACK_CONTROLLER = "CashBackController";
	public static final String CASHBACK_SERVICE = "CashbackService";
	public static final String CASHBACK_SERVICE_IMPL = "CashbackServiceImpl";
	public static final String CASHBACK_REPOSITORY = "CashbackRepository";
	public static final String CASHBACK_CARD_DETAIL_REPOSITORY = "CashbackCardDetailsRepository";
	public static final String CASHBACK_PRODUCT_REPOSITORY = "CashbackProductMappingRepository";
	public static final String CASHBACK_OFFER_DETAILS_REPOSITORY = "CashbackOfferDetailsRepository";

	// payment hostname constants
	public static final String NO_PAYMENT_HOSTNAME_FOUND_FOR_REQUESTED_ID = "No Payment Hostname Found for the requested Id";
	public static final String NO_CONTENT_AVAILABLE = "No content is available in uploaded file";
	public static final String ERR_PAY_014 = "ERR-PAY-014";
	public static final String ERR_PAY_015 = "ERR-PAY-015";

	/**
	 * GiftVoucher Constants
	 */

	public static final String GIFT_VOUCHER_CONTROLLER = "GiftVoucherController";
	public static final String GIFT_VOUCHER_SERVICE = "GiftVoucherService";
	public static final String GIFT_VOUCHER_SERVICE_IMPL = "GiftVoucherServiceImpl";
	public static final String GIFT_VOUCHER_REPOSITORY = "GiftVoucherRepository";

}
