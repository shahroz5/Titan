/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.constants;

import java.util.List;
import java.util.Set;

import com.titan.poss.core.domain.constant.DiscountTypeEnum;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public class SalesConstants {

	private SalesConstants() {
		throw new IllegalArgumentException("SalesConstants class");
	}

	public static final Integer DIVISION_SCALE = 11;
	public static final Integer PERCENT_SCALE = 2;
	public static final String PLAIN = "PLAIN";
	public static final String STUDDED = "STUDDED";
	public static final String PJWS = "PJWS";
	public static final String PLAIN_STUDDED = "PLAIN_STUDDED";
	
	public static final String ADJ = "ADJ";
	public static final String PSV = "PSV";

	public static final String GOLD_WEIGHT = "goldWeight";
	public static final String SILVER_WEIGHT = "silverWeight";
	public static final String PLATINUM_WEIGHT = "platinumWeight";
	public static final String STONE_WEIGHT = "stoneWeight";
	public static final String MATERIAL_WEIGHT = "materialWeight";
	public static final String DIAMOND_WEIGHT = "diamondWeight";

	public static final String LJ = "LJ"; // multimetals
	public static final String JL = "JL"; // multimetals

	public static final String FROZEN_RATE_DETAILS = "FROZEN_RATE_DETAILS";
	public static final String UUID_REGEX = "^[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}$";
	public static final String BIN_CHECK_REGEX = "^(?i).+(BIN)$";
	public static final String PDF_EXTENSION = "pdf";
	public static final String JPG_EXTENSION = "jpg";
	public static final String DATE_FORMAT = "yyyy-MM-dd";
	public static final String GEP_ITEM_CODE = "11GOZZK001";
	public static final String GEP_BIN_CODE = "GEP";
	public static final String L3_PURCFA = "PURCFA";
	public static final String L1_L2_STN = "STN";
	public static final String COIN_PRODUCT_GROUP_CODE = "73";
	public static final String SILVER_COIN_PRODUCT_GROUP_CODE = "82";
	public static final List<String> COIN_PRODUCT_GROUP_CODES = List.of("73","82");
	public static final String OTHER_CHARGE = "OTHERCHARGES";
	public static final String SUCCESS = "SUCCESS";
	public static final String FAILED = "FAILED";
	public static final String FILE_READER_METHOD_INVOKED_SUCCESSFULLY = "Ghs Bank Deposit file reader method invoked Successfully";
	public static final String FILE_READER_METHOD_INVOKE_FAILED = "Ghs Bank Deposit file reader method invoke Failed";
	public static final String FILE_READER_ERROR = "Error in reading CSV file";

	public static final String MOBILE_NO = "mobileNo";
	public static final String CUSTOMER_NAME = "customerName";
	public static final String FISCAL_YEAR = "fiscalYear";
	public static final String CUSTOMER_ID = "customerId";
	public static final String DOC_NO = "docNo";
	public static final String SRC_BTQ_CODE = "srcBtqCode";
	public static final String INSTI_TAX_NO = "instiTaxNo";
	public static final String PASSPORT_ID = "passportId";

	public static final String MOB_NO_TEN_NINES = "9999999999";
	public static final String MOB_NO_TEN_ZEROS = "0000000000";

	public static final String PAYMENT_CODE = "paymentCode";
	public static final String REASON = "reason";
	public static final String IS_RATE_PROTECTED_CN = "isRateProtectedCN";
	public static final String NEW_PAYMENT_IS_RIVAAH_GHS = "newPaymentIsRivaahGhs";
	public static final String NEW_PAYMENT_HAS_RIVAAH_GHS_DISCOUNT = "newPaymentHasRivaahGhsDiscount";
	public static final String NEW_PAYMENT_HAS_GHS_BONUS = "newPaymentHasGhsBonus";
	public static final String NEW_PAYMENT_IS_GRAMMAGE_GHS = "newPaymentIsGrammageGhs";
	public static final String NEW_PAYMENT_HAS_GRAMMAGE_GHS_DISCOUNT = "newPaymentHasGrammageGhsDiscount";

	public static final String BIN_GROUP = "binGroup";
	
	
	 public static final String FROM_DATE = "fromDate"; 
	 public static final String TO_DATE = "toDate";
	 

	// CORE error codes
		
	 public static final String ERROR_IN_PARSNG_JSON = "ERROR IN PARSNG JSON";
	 public static final String ERR_CORE_003 = "ERR-CORE-003";

	public static final String ERR_CORE_013 = "ERR-CORE-013";
	public static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";
	
	

	public static final String ERR_CORE_031 = "ERR-CORE-031";
	public static final String INCORRECT_PASWORD = "Incorrect password.";

	public static final String ERR_CORE_036 = "ERR-CORE-036";
	public static final String INCORRECT_DATA_DEFINED_IN_DATABASE = "Incorrect data defined in database";

	public static final String ERR_CORE_038 = "ERR-CORE-038";
	public static final String DATA_CONSTRAINT_VIOLATION = "Data constraint violation";

	public static final String ERR_CORE_042 = "ERR-CORE-042";
	public static final String INVALID_OTP = "Invalid OTP";

	// Integration error codes
	public static final String ERR_INT_025 = "ERR-INT-025";
	public static final String CALL_TO_EPOSS_FAILED = "Call to EPOSS Failed";

	// Locaion error codes
	public static final String ERR_LOC_086 = "ERR-LOC-086";
	public static final String HALLMARK_GST_PERCENTAGE_IS_NOT_CONFIGURED_FOR_THE_LOCATION = "Hallmark GST percentage is not configured for the location.";

	public static final String ERR_LOC_038 = "ERR-LOC-038";
	public static final String INVALID_METAL_RATE_DETAILS = "Invalid Metal Rate details";

	// SALE error codes

	public static final String ERR_SALE_002 = "ERR-SALE-002";
	public static final String ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS = "Item from {binGroup} cannot be sold to others.";

	public static final String ERR_CUST_001 = "ERR-CUST-001";
	public static final String MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING = "Mandatory fields of customer details are missing.";
	
	
	public static final String ERR_SALE_003 = "ERR-SALE-003";
	public static final String INVALID_SALES_TRANSACTION_ID = "Invalid sales transaction id";

	public static final String ERR_SALE_005 = "ERR-SALE-005";
	public static final String INVALID_TAX_VALUE = "Invalid tax value";

	public static final String ERR_SALE_006 = "ERR-SALE-006";
	public static final String INVALID_DYNAMIC_TYPE_ID = "Invalid {type} id.";

	public static final String ERR_SALE_007 = "ERR-SALE-007";
	public static final String WEIGHT_CANNOT_BE_CHANGED_IF_QUANTITY_IS_MORE_THAN_1 = "Weight cannot be changed if quantity is more than 1.";

	public static final String ERR_SALE_008 = "ERR-SALE-008";
	public static final String METAL_PRICE_CHANGED = "Metal rate changed";

	public static final String ERR_SALE_009 = "ERR-SALE-009";
	public static final String METAL_PRICE_NOT_SET_FOR_THE_DAY = "Metal rate not set for the day";

	public static final String ERR_SALE_018 = "ERR-SALE-018";
	public static final String PLEASE_PROVIDE_VALID_DATA_DYNAMIC_REASON = "Please provide valid data. Reason for failure: {reason}";

	public static final String ERR_SALE_110 = "ERR-SALE-110";
	public static final String PLEASE_SELECT_CUSTOMER_DETAILS = "Please select Customer details.";

	public static final String ERR_SALE_011 = "ERR-SALE-011";
	public static final String CUSTOMER_DETAILS_NOT_FOUND_FOR_THE_GIVEN_ID = "Customer details not found for the given id";

	public static final String ERR_SALE_013 = "ERR-SALE-013";
	public static final String INVALID_ITEM_ID = "Please reverse following payments(if added) - {paymentCodes}, to change customer.";

	public static final String ERR_SALE_015 = "ERR-SALE-015";
	public static final String INVALID_PAYMENT_CODE = "Invalid payment code.";

	public static final String ERR_SALE_016 = "ERR-SALE-016";
	public static final String RSO_NAME_IS_MANDATORY = "RSO Name is mandatory.";

	public static final String ERR_SALE_019 = "ERR-SALE-019";
	public static final String INVALID_INSTRUMENT_TYPE = "Invalid instrument type.";

	public static final String ERR_SALE_020 = "ERR-SALE-020";
	public static final String VALIDITY_DAYS_OR_REALISATION_DAYS_DETAILS_NOT_PRESENT = "Validity Days or Realisation Days details not present.";

	public static final String ERR_SALE_021 = "ERR-SALE-021";
	public static final String CHEQUE_OR_DD_VALIDITY_IS_EXPIRED = "Cheque or DD validity is expired.";

	public static final String ERR_SALE_023 = "ERR-SALE-023";
	public static final String CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION = "Configuration details not present for the location.";

	public static final String ERR_SALE_024 = "ERR-SALE-024";
	public static final String CUSTOMER_IS_NOT_ELIGIBLE_FOR_PAYMENT = "Customer is not eligible for payment.";

	public static final String ERR_SALE_026 = "ERR-SALE-026";
	public static final String AMOUNT_IS_NOT_IN_RANGE = "Amount is not in range.";

	public static final String ERR_SALE_027 = "ERR-SALE-027";
	public static final String GIFT_CARD_OR_VOUCHER_HAS_EXPIRED = "Gift Card/Voucher has expired.";

	public static final String ERR_SALE_029 = "ERR-SALE-029";
	public static final String CUSTOMER_DOES_NOT_HAVE_VALID_CONTACT_INFORMATION = "Customer does not have valid contact information.";

	public static final String ERR_SALE_030 = "ERR-SALE-030";
	public static final String PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER = "Payment exceeds due amount from customer.";

	public static final String ERR_SALE_031 = "ERR-SALE-031";
	public static final String ERROR_WHILE_TRIGGERING_PAYMENT = "Error while triggering payment.";

	public static final String ERR_SALE_032 = "ERR-SALE-032";
	public static final String DYNAMIC_PAYMENT_CODE_AMOUNT_AND_INPUT_AMOUNT_DO_NOT_MATCH = "{paymentCode} amount and input amount do not match.";

	public static final String ERR_SALE_034 = "ERR-SALE-034";
	public static final String DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_FOR_PAYMENT = "{paymentCode} is already added for payment.";

	public static final String ERR_SALE_035 = "ERR-SALE-035";
	public static final String PAYMENT_CANNOT_BE_DELETED = "Payment cannot be deleted.";

	public static final String ERR_SALE_036 = "ERR-SALE-036";
	public static final String INVALID_INPUT_STATUS = "Invalid input status.";

	public static final String ERR_SALE_037 = "ERR-SALE-037";
	public static final String PAYMENT_IS_IN_PROGRESS = "Payment is in progress.";

	public static final String ERR_SALE_038 = "ERR-SALE-038";
	public static final String PAYMENT_IS_COMPLETED = "Payment is Completed.";

	public static final String ERR_SALE_041 = "ERR-SALE-041";
	public static final String AMOUNT_EXCEEDS_ACCOUNT_BALANCE = "Amount exceeds account balance.";

	public static final String ERR_SALE_042 = "ERR-SALE-042";
	public static final String NO_PRODUCT_GROUP_MAPPING_FOUND = "No product group mapping found.";

	public static final String ERR_SALE_044 = "ERR-SALE-044";
	public static final String PRICE_MISMATCH = "Price Mismatch.";

	public static final String ERR_SALE_045 = "ERR-SALE-045";
	public static final String HOLD_TIME_EXPIRED_UPDATE_ITEM_PRICE = "Hold time expired, update item price.";

	public static final String ERR_SALE_046 = "ERR-SALE-046";
	public static final String NO_ITEM_FOUND_IN_THE_TRANSACTION = "No item(s) found in the transaction.";

	public static final String ERR_SALE_047 = "ERR-SALE-047";
	public static final String TRANSACTION_CANNOT_BE_PUT_ON_HOLD = "Transaction cannot be put on HOLD";

	public static final String ERR_SALE_048 = "ERR-SALE-048";
	public static final String INVALID_INPUTS = "Invalid inputs.";

	public static final String ERR_SALE_049 = "ERR-SALE-049";
	public static final String CUSTOMER_IS_NOT_VALID_FOR_THE_CURRENT_TRANSACTION = "Customer is not valid for the current transaction.";

	public static final String ERR_SALE_050 = "ERR-SALE-050";
	public static final String CUSTOMER_CANNOT_BE_CHANGED_FOR_THE_TRANSACTION = "Customer cannot be changed for the transaction.";

	public static final String ERR_SALE_051 = "ERR-SALE-051";
	public static final String INVALID_ITEM = "Invalid item.";

	public static final String ERR_SALE_053 = "ERR-SALE-053"; // handled at UI, so not to change the error
	public static final String PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS = "Please refresh screen for further actions.";
	
	public static final String ERR_SALE_452 = "ERR-SALE-452";
	public static final String TRANSACTION_IS_CLOSED_SO_STATUS = "Transaction is closed.Transaction status:{status}";

	
	public static final String ERR_SALE_054 = "ERR-SALE-054";
	public static final String TRANSACTION_CANNOT_BE_DELETED_REVERSE_ALL_PAYMENTS = "Transaction cannot be deleted. Reverse all payments.";

	public static final String ERR_SALE_055 = "ERR-SALE-055";
	public static final String ITEM_QUANTITY_EXCEEDS_INVENTORY_QUANTITY = "Item quantity exceeds inventory quantity.";

	public static final String ERR_SALE_058 = "ERR-SALE-058";
	public static final String HOST_NAME_IS_NOT_MAPPED_TO_PAYMENT_CODE = "Host name is not mapped to payment code.";

	public static final String ERR_SALE_059 = "ERR-SALE-059";
	public static final String INVALID_SUB_TRANSACTION_TYPE = "Invalid Sub transaction type.";

	public static final String ERR_SALE_060 = "ERR-SALE-060";
	public static final String INVALID_TRANSACTION_TYPE = "Invalid transaction type.";

	public static final String ERR_SALE_061 = "ERR-SALE-061";
	public static final String TOTAL_VALUE_OF_ADDED_PRODUCTS_EXCEEDING_MANUAL_BILL_AMOUNT = "Total value of added product(s) is exceeding manual bill amount.";

	public static final String ERR_SALE_062 = "ERR-SALE-062";
	public static final String TOTAL_VALUE_OF_ADDED_PRODUCTS_SHOULD_MATCH_WITH_MANUAL_BILL_AMOUNT = "Total value of added product(s) should match with manual bill amount.";

	public static final String ERR_SALE_064 = "ERR-SALE-064";
	public static final String PAN_MANDATORY_FOR_PURCHASING_ABOVE_CONFIGURED_AMOUNT = "PAN mandatory for purchasing above configured amount.";

	public static final String ERR_SALE_065 = "ERR-SALE-065";
	public static final String MANUAL_BILL_IS_USED = "Manual bill is already validated and can be accessed in Open Task {taskNumber}.";

	public static final String ERR_SALE_413 = "ERR-SALE-413";
	public static final String PLEASE_PROVIDE_FORM60_DETAILS_AS_PAYMENT_EXCEEDED_ALLOWED_PAYMENT_LIMIT_WITHOUT_FORM60_DETAILS = "Please provide Form60 details as payment amount exceeded allowed payment limit without Form60 details";

	public static final String ERR_SALE_080 = "ERR-SALE-080";
	public static final String ADD_CUSTOMER_DETAILS = "Add customer details before adding/updating an item.";

	public static final String ERR_SALE_081 = "ERR-SALE-081";
	public static final String CLICK_PRE_DECLARATION_FORM = "Click pre declaration form checkbox";

	public static final String ERR_SALE_083 = "ERR-SALE-083";
	public static final String RATE_NOT_FOUND_FOR_REQUIRED_METAL = "Rate not found for required metal.";

	public static final String ERR_SALE_084 = "ERR-SALE-084";
	public static final String PLEASE_REVERSE_FOLLOWING_DYNAMIC_PAYMENTS_TO_MAKE_UPDATES_TO_ITEM_LIST = "Please reverse following payments(if added) - {paymentCodes}, to make updates to item list.";

	public static final String ERR_SALE_086 = "ERR-SALE-086";
	public static final String SUBMIT_PRE_DECLARATION_FORM = "Submit pre declaration form";

	public static final String ERR_SALE_088 = "ERR-SALE-088";
	public static final String DYNAMIC_PAYMENTCODE_CANNOT_BE_USED_AS_PAYMENT = "{paymentCode} cannot be used as payment.";

	public static final String ERR_SALE_089 = "ERR-SALE-089";
	public static final String ITEM_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO = "Item is already added in {transactionType} {taskType} task number: {docNo}.";

	public static final String ERR_SALE_091 = "ERR-SALE-091";
	public static final String PAYMENT_CANNOT_BE_USED_FOR_OTHER_CUSTOMER = "Payment cannot be used for other customer.";

	public static final String ERR_SALE_099 = "ERR-SALE-099";
	public static final String TOTAL_WEIGHT_OF_ADDED_PRODUCTS_EXCEEDING_MANUAL_BILL_WEIGHT = "Total weight of added product(s) is exceeding manual bill weight.";

	public static final String ERR_SALE_100 = "ERR-SALE-100";
	public static final String TOTAL_WEIGHT_OF_ADDED_PRODUCTS_SHOULD_MATCH_WITH_MANUAL_BILL_WEIGHT = "Total weight of added product(s) should match with manual bill weight.";

	public static final String ERR_SALE_103 = "ERR-SALE-103";
	public static final String SOME_ITEMS_IN_THE_TRANSACTION_ARE_OUT_OF_STOCK_KINDLY_DELETE_THEM = "Some items in the transaction are out of stock. Kindly delete them.";

	public static final String ERR_SALE_127 = "ERR-SALE-127";
	public static final String WEIGHT_CANNOT_BE_EDITED = "Weight cannot be edited.";

	public static final String ERR_SALE_131 = "ERR-SALE-131";
	public static final String ITEM_NOT_AVAILABLE = "Item(s) not available.";

	public static final String ERR_SALE_140 = "ERR-SALE-140";
	public static final String PLEASE_CHECK_THE_STATUS = "Please check the status";

	public static final String ERR_SALE_144 = "ERR-SALE-144";
	public static final String CREDIT_NOTE_OR_GHS_PAYMENT_SHOULD_MATCH_REMAINING_AMOUNT_OF_TRANSACTION = "Credit note/GHS payment should match remaining amount of transaction.";

	public static final String ERR_SALE_145 = "ERR-SALE-145";
	public static final String NO_PRIORITY_DETAILS_FOUND_FOR_THE_CREDIT_NOTE = "No priority details found for the credit note.";

	public static final String ERR_SALE_154 = "ERR-SALE-154";
	public static final String CREDIT_NOTE_NOT_FOUND = "No credit note found";

	public static final String ERR_SALE_157 = "ERR-SALE-157";
	public static final String CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS = "Credit note number - {docNo}, should be in open status.";

	public static final String ERR_SALE_158 = "ERR-SALE-158";
	public static final String CREDIT_NOTE_DYNAMIC_NUMBER_IS_REQUESTED_FOR_APPROVAL = "Credit note number - {docNo}, is requested for approval.";

	public static final String ERR_SALE_161 = "ERR-SALE-161";
	public static final String CREDIT_NOTE_AMOUNT_IS_LESS_THAN_THE_UTILIZED_AMOUNT = "Credit note amount is less than the utilized amount";

	public static final String ERR_SALE_162 = "ERR-SALE-162";
	public static final String LINKED_CREDIT_NOTES_CANNOT_BE_REDEEMED_INDIVIDUALLY = "Linked credit notes cannot be redeemed individually.";

	public static final String ERR_SALE_164 = "ERR-SALE-164";
	public static final String MAX_LIMIT_REACHED_FOR_CURRENT_PAYMENT_TYPE = "Max limit reached for current payment type.";

	public static final String ERR_SALE_166 = "ERR-SALE-166";
	public static final String CREDIT_NOTE_CANNOT_BE_USED_AS_PAYMENT = "Credit note cannot be used as payment. Delete Credit Notes with lower priority.";

	public static final String ERR_SALE_170 = "ERR-SALE-170";
	public static final String PLEASE_PROVIDE_REMARKS = "Please provide remarks.";

	public static final String ERR_SALE_179 = "ERR-SALE-179";
	public static final String PLEASE_UPDATE_PAN_CARD_DETAILS_AT_BRAND_LEVEL = "Please update the pan card details at the brand level.";
	

	public static final String ERR_SALE_181 = "ERR-SALE-181";
	public static final String ITEM_CANNOT_BE_DELETED = "Item cannot be deleted.";

	public static final String ERR_SALE_182 = "ERR-SALE-182";
	public static final String PLEASE_ADD_VALID_CARD_PAYMENT_TO_AVAIL_CASHBACK = "Please add valid 'CARD' payment to avail 'CASHBACK'.";

	public static final String ERR_SALE_183 = "ERR-SALE-183";
	public static final String MANUAL_BILL_DATE_SHOULD_NOT_EXCEED_CURRENT_BUSINESS_DATE = "Manual bill date should not exceed current business date.";

	public static final String ERR_SALE_186 = "ERR-SALE-186";
	public static final String PAYMENT_FAILED_BASED_ON_BUSINESS_RESTRICTION = "Payment Failed based on business restriction.";

	public static final String ERR_SALE_192 = "ERR-SALE-192";
	public static final String FAILED_TO_DELETE_TRANSACTIONS = "Business Day is not Open";

	public static final String EPOSS_CM_BASE_URL = "/cash-memos/eposs";
	public static final String EPOSS_PRODUCT_BASE_URL = "/product-groups";
	
	public static final String EPOSS_CHECK_CM_BASE_URL = "/cash-memos/eposs/check-cm";
	

	public static final String ERR_SALE_196 = "ERR-SALE-196";
	public static final String NO_CM_DETAILS_ID = "No cash memo details found for the requested cash memo details id";

	public static final String ERR_SALE_197 = "ERR-SALE-197";
	public static final String QTY_SHOULD_NOT_BE_MORE_THAN_CM_DETAILS_QTY = "Quantity should not more than cash memo details quantity";

	public static final String ERR_SALE_198 = "ERR-SALE-198";
	public static final String ITEM_CANNOT_MOVE_TO_TEP_SALEABLE_BIN = "This item cannot go to TEP saleable bin";

	public static final String ERR_SALE_199 = "ERR-SALE-199";
	public static final String CM_NOT_CONFIRMED = "CM is not in CONFIRMED status";

	public static final String ERR_SALE_200 = "ERR-SALE-200";
	public static final String ITEM_CODE_DIFFERENT_THAN_CM_ITEM_CODE = "ItemCode input doesn't match with CM itemCode";

	public static final String ERR_SALE_205 = "ERR-SALE-205";
	public static final String INPUT_QUANTITY_SHOULD_MATCH_WITH_CM_QUANTITY = "Input quantity should match with CM item quantity";

	public static final String ERR_SALE_208 = "ERR-SALE-208";
	public static final String CASH_PAID_BY_CUSTOMER_EXCEEDS_LIMIT = "Cash paid by customer exceeds limit.";

	public static final String ERR_SALE_211 = "ERR-SALE-211";
	public static final String ACCOUNT_DETAILS_NOT_FOUND = "Account details not found.";

	public static final String ERR_SALE_212 = "ERR-SALE-212";
	public static final String ACCOUNT_CANNOT_BE_USED_AS_PAYMENT_DYNAMIC_REASON = "Account cannot be used as payment. Reason: {reason}";

	public static final String ERR_SALE_213 = "ERR-SALE-213";
	public static final String PAID_AMOUNT_SHOULD_NOT_BE_LESS_THAN_MINIMUM_UTILIZATION = "Paid amount should not be less than minimum utilization.";

	public static final String ERR_SALE_214 = "ERR-SALE-214";
	public static final String ACCOUNT_IS_ALREADY_ADDED_FOR_PAYMENT = "Account is already added for payment.";

	public static final String ERR_SALE_223 = "ERR-SALE-223";
	public static final String PAYMENT_CANNOT_BE_EDITED = "Payment cannot be edited.";

	public static final String ERR_SALE_233 = "ERR-SALE-233";
	public static final String CREDIT_NOTE_IS_GENERATED_FOR_EGHS = "Credit note is generated for EGHS.";

	public static final String ERR_SALE_238 = "ERR-SALE-238";
	public static final String PLEASE_PROVIDE_OTP = "Please provide OTP.";

	public static final String ERR_SALE_254 = "ERR-SALE-254";
	public static final String BEST_GOLD_RATE_CONFIGURATION_IS_INVALID = "Best Gold Rate configuration is invalid.";

	public static final String ERR_SALE_262 = "ERR-SALE-262";
	public static final String AMOUNT_IS_INVALID_FOR_THE_DYNAMIC_PAYMENTCODE_PAYMENT_VALID_AMOUNT_IS_DYNAMIC_VALIDAMOUNT = "Amount is invalid for the {paymentCode} payment in current transaction. Amount is allowed upto:  {validAmount}.";

	public static final String ERR_CORE_014 = "ERR-CORE-014";
	public static final String JSON_TYPE_MISMATCH = "JSON type mismatch";

	public static final String ERR_SALE_290 = "ERR-SALE-290";
	public static final String DYNAMIC_PAYMENT_CODE_CANNOT_BE_USED_MULTIPLE_TIMES = "{paymentCode} cannot be used multiple times.";

	public static final String ERR_SALE_294 = "ERR-SALE-294";
	public static final String INVALID_REQUEST = "Invalid Request: - {remarks}";

	public static final String ERR_SALE_297 = "ERR-SALE-297";
	public static final String KINDLY_UPLOAD_DYNAMIC_DOCUMENT_BEFORE_DYNAMIC_ACTION = "Kindly upload {document} before {action}.";

	public static final String ERR_SALE_318 = "ERR-SALE-318";
	public static final String CANNOT_TRANSFER_CREDIT_NOTE_LINKED_TO_ADVANCE_BOOKING = "Cannot transfer credit note linked to Advance Booking.";

	public static final String ERR_SALE_323 = "ERR-SALE-323";
	public static final String GEP_OFFER_CANNOT_BE_USED_AS_DYNAMIC_TYPE = "GEP Offer cannot be used as {type}.";

	public static final String ERR_SALE_324 = "ERR-SALE-324";
	public static final String PLEASE_DELETE_RELATED_DISCOUNT_BEFORE_DELETING_PAYMENT = "Please delete related discount before deleting payment.";

	public static final String ERR_SALE_325 = "ERR-SALE-325";
	public static final String PLEASE_CONFIRM_RELATED_DISCOUNT_BEFORE_COMPLETING_PAYMENT = "Please confirm related discount before completing payment.";

	public static final String ERR_SALE_326 = "ERR-SALE-326";
	public static final String DYNAMIC_PAYMENTCODE_DYNAMIC_CARDNO_CANNOT_BE_REDEEMED_ON_ITEMS_ADDED = "{paymentCode} - {cardNo} cannot be redeemed for the items added.";

	public static final String ERR_SALE_328 = "ERR-SALE-328";
	public static final String MAX_ITEMS_ALLOWED_IN_TRANSACTION_IS_DYNAMIC_NUMBER_OF_ITEMS = "Max items allowed in transaction is {numberOfItems}";

	public static final String ERR_SALE_341 = "ERR-SALE-341";
	public static final String CASH_PAID_BY_CUSTOMER_EXCEEDS_PMLA_LIMIT = "Cash payment eligible limit {maxCashPmlaLimit} is reached.";

	public static final String ERR_SALE_359 = "ERR-SALE-359";
	public static final String TCS_PAYMENT_NOT_VALID = "TCS payment not valid.";

	public static final String ERR_SALE_360 = "ERR-SALE-360";
	public static final String CLEAR_TCS_AMOUNT_FOR_FURTHER_UPDATES_ON_TRANSACTION = "Clear TCS amount for further updates on transaction.";

	public static final String ERR_SALE_361 = "ERR-SALE-361";
	public static final String REMOVE_ALL_ITEMS_AND_PAYMENTS_TO_ADD_RATE_PROTECTED_CREDIT_NOTE = "Remove all items and payments to add rate protected Credit note.";

	public static final String ERR_SALE_362 = "ERR-SALE-362";
	public static final String DYNAMIC_METALTYPE_ITEM_DOES_NOT_BELONG_TO_ALLOWED_CATEGORY_DYNAMIC_ALLOWEDCATEGORY = "{metalType} item does not belong to allowed category: {allowedCategory}.";

	public static final String ERR_SALE_363 = "ERR-SALE-363";
	public static final String INVOICE_AMOUNT_LESS_THAN_MINIMUM_WEIGHT_AND_VALUE_TOLERANCE = "Invoice Amount less than minimum weight and Value tolerance.";

	public static final String ERR_SALE_364 = "ERR-SALE-364";
	public static final String TOTAL_WEIGHT_EXCEEDS_MAXIMUM_WEIGHT = "Total weight exceeds maximum weight.";

	public static final String ERR_SALE_365 = "ERR-SALE-365";
	public static final String TOTAL_VALUE_EXCEEDS_MAXIMUM_VALUE = "Total value exceeds maximum value.";

	public static final String ERR_SALE_370 = "ERR-SALE-370";
	public static final String DURATION_IS_CROSSED_TO_REDEEM_THE_ACCOUNT_IN_DYNAMIC_TRANSACTION_TYPE = "Duration is crossed to redeem the account in {transactionType}.";

	public static final String ERR_SALE_376 = "ERR-SALE-376";
	public static final String ALL_CN_STATUS = "All the creditNotes are not in {status} status to do the selected operation";

	public static final String ERR_SALE_377 = "ERR-SALE-377";
	public static final String ALL_CN_GOLD_RATE = "Gold Rate is not protected for all the creditNotes";

	public static final String ERR_SALE_378 = "ERR-SALE-378";
	public static final String ALL_CN_LINKED_EXP = "Some of the creditNotes are linked to other transactions";

	public static final String ERR_SALE_404 = "ERR-SALE-404";
	public static final String ALL_CN_LINKED_APPR = "Some of the creditNotes are requested for approval";

	public static final String ERR_SALE_379 = "ERR-SALE-379";
	public static final String ALL_CN_WORKFLOW_EXP = "Some of the creditNotes are not in post transfer suspend status";

	public static final String ERR_SALE_382 = "ERR-SALE-382";
	public static final String DYNAMIC_PAYMENT_CODE_CANNOT_BE_USED_FOR_TCS_PAYMENT_AS_IT_IS_NOT_CONFIGURED = "{paymentCode} cannot be used as payment for TCS, as it is not configured.";

	public static final String ERR_SALE_383 = "ERR-SALE-383";
	public static final String TOTAL_VALUE_EXCEEDS_EMPLOYEE_LOAN_AMOUNT = "Input Amount should be less than approved loan amount";

	public static final String ERR_SALE_384 = "ERR-SALE-384";
	public static final String EMPLOYEE_LOAN_ALREADY_GIVEN = "Employee Loan has been already given to this customer";

	public static final String ERR_SALE_385 = "ERR-SALE-385";
	public static final String TOTAL_VALUE_LESS_THAN_MARGIN_AMOUNT = "Input Amount should be greater than minimum margin amount";

	public static final String ERR_SALE_386 = "ERR-SALE-386";
	public static final String TRANSACTION_CANNOT_BE_CANCELLED_AS_TEP_IS_DONE_FOR_IT = "Transaction cannot be cancelled as TEP is done for it.";

	public static final String ERR_SALE_387 = "ERR-SALE-387";
	public static final String CM_CANCLED = "Bill cancellation done, CM status {status}";

	public static final String ERR_SALE_388 = "ERR-SALE-388";
	public static final String CM_TOBE_CANCLE = "Bill cancellation in progress, status {status}";

	public static final String ERR_SALE_390 = "ERR-SALE-390";
	public static final String DYNAMIC_PAYMENTCODE_REALISATION_DAYS_HAS_NOT_PASSED_FOR_DYNAMIC_TXNTYPE = "{paymentCode} realisation days has not passed for {txnType}.";

	public static final String ERR_SALE_391 = "ERR-SALE-391";
	public static final String CUSTOMER_IS_ELIGIBLE_TO_PAY_TCS_EITHER_PAN_OR_FORM60_IS_MANDATORY = "Customer is eligible to pay TCS, either PAN or form60 is mandatory";

	public static final String ERR_SALE_392 = "ERR-SALE-392";
	public static final String DYNAMIC_MINIMUMUTILIZATIONPCT_OF_DYNAMIC_PAYMENTCODE_AMOUNT_TO_BE_UTILIZED = "{minimumUtilizationPct} of {paymentCode} amount to be utilized.";

	public static final String NO_APPROVAL_DATE = "Approval details missing for FVTEP {approverType}";
	public static final String ERR_SALE_394 = "ERR-SALE-394";

	public static final String ERR_SALE_395 = "ERR-SALE-395";
	public static final String AB_NO_ALREADY_INVOKED_FOR_BILLING = "AB No {ABDocNo} already invoked for billing in {status} {txnType} {docNo}.";

	public static final String ERR_SALE_397 = "ERR-SALE-397";
	public static final String CHEQUE_REALIZATION_DAYS_NOT_PRESENT_FOR_THE_LOCATION = "Cheque realization days not present for the location.";

	public static final String ERR_SALE_398 = "ERR-SALE-398";
	public static final String TOTAL_VALUES_MISMATCH = "Total - {inputType} expected - {expected}, found - {found}";

	public static final String ERR_SALE_400 = "ERR-SALE-400";
	public static final String ITEM_IN_TEP_FLOW = "Added item {itemList} already in TEP approval flow- at {locationCode} location";

	public static final String ERR_SALE_401 = "ERR-SALE-401";
	public static final String CONFIGURATION_NOT_PRESENT_FOR_TEP_HOLD_TIME_IN_MINUTES_FIELD_UNDER_TEP_DETAILS_FOR_LOCATION = "Configuration not present for 'tepHoldTimeInMinutes' field under TEP details for location";

	public static final String ERR_SALE_403 = "ERR-SALE-403";
	public static final String RAZORPAY_PAYMENT_FAILURE_REASON = "Payment failed due to {reason}";

	public static final String ERR_SALE_405 = "ERR-SALE-405";
	public static final String REFUND_NOT_ALLOWED_FOR_INTERBRAND = "Refund not allowed for Interbrand TEP, configured locationCode: {locationCode} and IsInterBrandCashRefundAllowed: {IsInterBrandCashRefundAllowed}";

	public static final String ERR_SALE_409 = "ERR-SALE-409";
	public static final String DYNAMIC_PAYMENT_CODE_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO = "{paymentCode} is already added in {transactionType} {taskType} task number: {docNo}.";

	public static final String ERR_SALE_417 = "ERR-SALE-417";
	public static final String GHS_EVOUCHER_CARD_CANT_BE_ADDED_AS_QCGC_PAYMENT = "GHS EVoucher Card can't be added as QCGC Payment";

	public static final String ERR_SALE_418 = "ERR-SALE-418";
	public static final String QCGC_CARD_CANT_BE_ADDED_AS_GHS_EVOUCHER_PAYMENT = "QCGC Card can't be added as GHS EVoucher Payment";

	public static final String ERR_SALE_440 = "ERR-SALE-440";

	public static final String UPLOAD_CUSTOMER_ID_PROOF_FOR_CN_REDEMPTION = "Please upload the customer ID proof for CN redemption";
	
	public static final String ERR_SALE_443 = "ERR-SALE-443";
	public static final String STOCK_UNDER_ADJ_REQUEST = "The stock (ADJ) request raised with Commercial";
	
	public static final String ERR_SALE_444 = "ERR-SALE-444";
	public static final String STOCK_UNDER_PSV_REQUEST = "The stock (PSV) request raised with Commercial";
	
	public static final String CREDIT_NOTE_GENERATED_FOR_EGHS_CANNOT_BE_TRANSFERRED_PARTIALLY = "Credit note generated for EGHS cannot be transferred partially.";

	public static final String ERR_SALE_425 = "ERR-SALE-425";
	public static final String CONFIGURATION_NOT_PRESENT_FOR_THE_ROLE = "Configuration not present for the Role";
	
	public static final String ERR_SALE_436 = "ERR-SALE-436";
	public static final String QTY_EXCEEDS_FOR_SELECTED_FOC = "QTY exceeds for selected foc items";
	
	public static final String ERR_SALE_445 = "ERR-SALE-445";
	public static final String TRANSACTION_IS_IN = "Void Cannot be done as transaction is in {status}";
	
	public static final String ONLY_FULL_GRN_IS_ALLOWED = "Only Full GRN is allowed as partial payment is voided";
	public static final String ERR_SALE_446 = "ERR-SALE-446";

	public static final String INPUT_TYPE = "input type : ";
	public static final String EXPECTED_TYPE = "& expected type :";

	public static final String LOC_CODE = "locationCode";

	public static final String INVALID_STATUS_UPDATE = "Invalid status update";
	public static final String STATUS = "status : ";

	public static final String ERR_CONFIG_151 = "ERR-CONFIG-151";

	// Discount related Constants starts here

	public static final String ERR_DISC_004 = "ERR-DISC-004";
	public static final String DYNAMIC_DISCOUN_TYPE_NOT_ALLOWED_IN_DYNAMIC_TRANSACTION_TYPE = "{discountYpe} not allowed in {transactionType}.";

	public static final String ERR_DISC_014 = "ERR-DISC-014";
	public static final String ADD_OR_UPDATE_OF_ITEM_OR_DISCOUNT_NOT_ALLOWED_AS_BILL_DISCOUNT_APPLIED_PLEASE_REMOVE_PAYMENTCODE_OR_DISCOUNT_TO_PROCEED = "Add or Update of item or discount not allowed as Bill discount applied.Please remove {paymentCodeOrDiscount} to proceed";

	public static final String ERR_DISC_019 = "ERR-DISC-019";
	public static final String TATA_EMPLOYEE_DETAILS_NOT_FOUND = "Tata Employee details not found to validate";

	public static final String ERR_DISC_026 = "ERR-DISC-026";
	public static final String ERR_DISC_027 = "ERR-DISC-027";

	public static final String ERR_DISC_028 = "ERR-DISC-028";
	public static final String DISCOUNTTYPE_OF_OTHER_CUSTOMER_CANNOT_BE_USED = "{discountType} of other customer cannot be used before using own.";

	public static final String ERR_DISC_029 = "ERR-DISC-029";
	public static final String DYNAMIC_DISCOUNTTYPE_DYNAMIC_VOUCHER_IS_ALREADY_ADDED = "{discountType} - {voucher}, is already added.";

	public static final String ERR_DISC_030 = "ERR-DISC-030";
	public static final String DISCOUNT_CANNOT_BE_DELETED_REASON_DYNAMIC_REASON = "Discount cannot be deleted. Reason - {reason}.";

	public static final String ERR_DISC_032 = "ERR-DISC-032";
	public static final String DISCOUNT_EXCEEDS_ITEM_VALUE_FOR_SOME_ITEMS = "Discount exceeds item value for some items.";

	public static final String ERR_DISC_033 = "ERR-DISC-033";
	public static final String DYNAMIC_DISCOUNT_CODE_CANNOT_BE_CLUBBED_WITH_DYNAMIC_INVALID_DISCOUNT_CODES = "{discountCode} cannot be clubbed with {invalidDiscountCodes}";

	public static final String ERR_DISC_034 = "ERR-DISC-034";
	public static final String PLEASE_DELETE_FOLLOWING_DISCOUNTS_IF_ADDED_DYNAMIC_DISCOUNTS_TO_MAKE_PRICE_UPDATES = "Please delete following discounts(if added) - {discountCodes}, to make price updates. ";

	public static final String ERR_DISC_035 = "ERR-DISC-035";
	public static final String MULTIPLE_OFFERS_AVAILABLE_FOR_THE_TRANSACTION_PLEASE_SELECT_ONE_OFFER = "Multiple offers available for the transaction. Please select one offer.";

	public static final String ERR_DISC_036 = "ERR-DISC-036";
	public static final String SELECTED_OFFER_IS_NOT_APPLICABLE_IN_CURRENT_TRANSACTION = "Selected offer is not applicable in current transaction.";

	public static final String ERR_DISC_037 = "ERR-DISC-037";
	public static final String ENTERED_DV_IS_NOT_ALLOWED_FOR_GOLD_COINS = "Entered DV is not allowed for gold coins.";

	public static final String ERR_DISC_039 = "ERR-DISC-039";
	public static final String DISCOUNT_ALREADY_APPLIED = "{discountType} - {discountCode} is already applied";

	public static final String ERR_DISC_040 = "ERR-DISC-040";
	public static final String WEIGHT_CANNOT_BE_EDITED_AS_TRANSACTION_LEVEL_DISCOUNTS_ARE_ADDED = "Weight cannot be edited as transaction level discounts are added.";

	public static final String ERR_DISC_042 = "ERR-DISC-042";
	public static final String DYNAMIC_DISCOUNTTYPE_OFFER_HAS_EXPIRED = "{discountType} offer has expired.";
	
	public static final String REMARKS = "remarks";

	public static final String DISCOUNT_CONFIG = "discountConfig";
	public static final String CARAT_BASED = "CARAT_BASED";
	public static final String DISCOUNT_CODE = "discountCode";
	public static final String DISCOUNT_TYPE = "discountType";
	public static final String DISCOUNT_TXN_DETAILS = "DISCOUNT_TXN_DETAILS";
	
	public static final String CUSTOMER_NOT_FOOUND_FOR_MOBILR_NUMBER = "Customer not found for mobile number : {mobileNo}";
	public static final String ERR_COM_001 = "ERR-COM-001";
	
	public static final String COM_ORDERS_CANNOT_BE_COMBINED = "COM Orders Cannot be Combined";
	public static final String ERR_COM_002 = "ERR-COM-002";
	
	public static final String NO_CONFIG_FOR_ITEM_TYPE_CODE = "No Configuration is available for this metal type";
	public static final String ERR_COM_003 = "ERR-COM-003";
	
	public static final String CO_BELONGS_TO_DIFF_CUSTOMER = "Selected Customer Orders belongs to different customers";
	public static final String ERR_COM_004 = "ERR-COM-004";
	
	public static final String SELECTED_CO_ARE_OF_DIFF_TYPE = "Selected Customer Orders are of different types";
	public static final String ERR_COM_005 = "ERR-COM-005";

	public static final String CO_BELONGS_TO_DIFF_CUSTOMER_AND_OF_DIFF_TYPES = "Selected Customer Orders belongs to different customers and are of different types";
	public static final String ERR_COM_006 = "ERR-COM-006";
	
	public static final String NO_CUSTOMER_ORDER_IS_SELECTED = "No Customer Order is selected";
	public static final String ERR_COM_007 = "ERR-COM-007";	
	
	public static final String CONFIGURATION_DETAILS_OF_CO_IS_NOT_PRESENT_FOR_THE_LOCATION = "CO details for location";
	public static final String ERR_COM_008 = "ERR-COM-008";

	public static final String INVOICE_VALUE = "Invoice value";
	public static final String OVERRIDING_VALUE = "Overriding Value";
	public static final String CURRENT_VALUE = "Current value";
	public static final String FULL_VALUE = "Full Value";
	public static final String PROPOTIONED_VALUE = "PROPORTIONED Value";

	public static final Set<String> CUSTOMER_DEPENDENT_DISCOUNTS = Set.of(
			DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name(), DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name(),
			DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name(), DiscountTypeEnum.EMPLOYEE_DISCOUNT.name(),
			DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name(), DiscountTypeEnum.TSSS_DISCOUNT.name(),
			DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name(), DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(),
			DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name());

	public static final Set<String> DISCOUNTS_APPLICABLE_IN_ORDER = Set.of(DiscountTypeEnum.CATEGORY_DISCOUNT.name(),
			DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(), DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name(),
			DiscountTypeEnum.BEST_DEAL_DISCOUNT.name(), DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name());

	public static final String NOMINEE_DETAILS = "NOMINEE_DETAILS";
	
	public static final String AB_CANNOT_BE_CANCELLED_AS_IT_IS_NOT_AVAILABLE_NOT_IN_CONFIRM_STATUS  ="AB cannot be CANCELLED as it is NOT AVAILABLE / not in CONFIRMED Status";

	// Discount related constants ends here

}
