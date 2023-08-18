/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class RegExConstants {

	private RegExConstants() {
		throw new IllegalArgumentException("RegExConstants class");
	}

	// generic regEx starts here

	/*
	 * used @ descriptions and remarks (special characters not allowed)
	 */
	// ^[\w ?\\%\/\(\)\[\],&-."#'@+<=>:]+$ --------> _ space ? \ % / ( ) [ ] & , - .
	// " # < = > + ' @ :
	// characters are allowed with alpha numeric value
	public static final String DESCRIPTION_REGEX_SPCL_CHAR_MAX_50 = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,50}$";
	public static final String DESCRIPTION_REGEX_SPCL_CHAR_MAX_100 = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,100}$";
	public static final String DESCRIPTION_REGEX_SPCL_CHAR_MAX_250 = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,250}$";
	public static final String DESCRIPTION_REGEX_SPCL_CHAR_MAX_255 = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,255}$";
	
	public static final String DESCRIPTION_REGEX_SPCL_CHAR_MAX_255_NEW_LINE = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@\\n+<=>:]{1,255}$";

	/*
	 * . and - allowed with alphabets and space.
	 */
	public static final String DESCRIPTION_REGEX_SPC_DOT_HPN = "^[A-Za-z-. ]{1,50}$";
	public static final String DESCRIPTION_REGEX_SPC_MAX_20 = "^[A-Za-z ]{1,20}$";
	public static final String DESCRIPTION_REGEX_SPC_MAX_30 = "^[\\w ]{1,30}$";
	public static final String DESCRIPTION_REGEX_MAX_50 = "^[\\w ]{1,50}$";
	public static final String DESCRIPTION_REGEX_MAX_100 = "^[\\w ]{1,100}$";
	public static final String DESCRIPTION_REGEX_MAX_255 = "^[\\w ]{1,255}$";

	public static final String DESCRIPTION_REGEX_MAX_250 = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,250}$";
	public static final String ALPHA_NUMERIC_REGEX = "^[a-zA-Z0-9]+$";
	public static final String REGEX_MSG = "Invalid Field Value.";
	public static final String ALPHA_REGEX_MAX_20 = "^[A-Za-z]{1,20}$";
	public static final String ALPHA_REGEX_MAX_50 = "^[A-Za-z]{1,50}$";
	public static final String ALPHA_NUMERIC_REGEX_MAX_20 = "^[A-Za-z0-9]{1,20}$";
	public static final String ALPHA_NUMERIC_REGEX_MAX_30 = "^[A-Za-z0-9 ]{1,30}$";// space allowed here
	public static final String ALPHA_NUMERIC_REGEX_MAX_50 = "^[A-Za-z0-9]{1,50}$";
	public static final String ALPHA_NUMERIC_REGEX_MAX_250 = "^[A-Za-z0-9]{1,250}$";
	public static final String ALPHA_NUMERIC_REGEX_WITH_SPACE_MAX_20 = "^[A-Za-z0-9-_ ]{1,20}$";
	public static final String WORD_REGEX_MAX_20 = "^[\\w]{1,20}$";// need to ask satish
	public static final String WORD_SEPARATOR = "\\s+";
	public static final String ALPHA_REGEX_CAPS_ONLY_MAX_20 = "^[A-Z]{1,20}$";
	public static final String ALPHA_NUMERIC_SPACE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String ALPHA_NUMERIC_SPACE_REGEX_50 = "^[A-Za-z0-9 ]{1,50}$";
	public static final String ALPHA_CAPS_REGEX_MAX_3 = "^[A-Z]{1,3}$";
	public static final String NUMERIC_REGEX = "^[0-9]{1,20}$";
	public static final String ALPHA_CAPS_REGEX_MIN_2_MAX_5 = "^[A-Z]{2,5}$";
	public static final String ALPHA_CAPS_SPACE_REGEX_MAX_20 = "^[A-Z ]{2,20}$";
	public static final String ALPHABETS_WITH_SPACE_REGEX = "^[a-zA-Z]([ \\-]?[a-zA-Z]+)*$";
	public static final String ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_250 = "^[\\w ?\\\\%\\/\\(\\),&-.']{1,250}$";
	public static final String ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_20 = "^[\\w ?\\\\%\\/\\(\\),&-.']{1,20}$";
	public static final String ADDRESS_REGEX = "^[A-Za-z0-9?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>: ]{1,40}$";
	public static final String NUMERIC_WITH_SPL_CHAR = "[- 0-9]+";

	// PENDING test if it works
	public static final String NOT_SAME_CHAR_ACROSS = "^(?!(.)\\1+$).*";

	// generic regEx ends here

	// location related regEx starts here

	// factory_code,cfa_code,old_factory_code should be used the same regEx
	public static final String LOCATION_CODE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String STATE_CODE_REGEX = "^[A-Z]{2,3}$";
	public static final String PIN_CODE_REGEX = "^[1-9][0-9]{5}$";

	// LOCATIONTYPE,OWNERTYPE,MATERIALPRICETYPE,LOCATIONFORMAT -------> LOV type
	public static final String LOCATION_LOV_CODE_REGEX = "^[A-Za-z0-9 ]{1,50}$";
	public static final String LOCATION_LOV_VALUE_REGEX = "^[A-Za-z0-9 ]{1,50}$";
	public static final String MARKET_CODE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String TOWN_NAME_REGEX = "^[A-Za-z ]{1,20}$";
	public static final String STATE_NAME_REGEX = "^[A-Za-z0-9- ]{1,50}$";
	public static final String COUNTRY_CODE_REGEX = "^[A-Z]{1,3}$";
	public static final String COUNTRY_NAME_REGEX = "^[A-Za-z ]{1,20}$";

	// sub_region_cde should be used the same regEx
	public static final String REGION_CODE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String ORG_CODE_REGEX = "^[A-Z]{1,4}$";
	public static final String TAX_CLASS_CODE_REGEX = ALPHA_NUMERIC_REGEX_MAX_20;
	public static final String TAX_CODE_REGEX = "^[A-Za-z\\/]{3,10}$";
	public static final String FAX_CODE_REGEX = NUMERIC_REGEX;
	public static final String REGISTRATION_NO_REGEX = "^[A-Z0-9]{1,50}$";
	public static final String ISD_CODE_REGEX = "^\\+?[\\d]{1,9}$";

	// that should be used for base currency,stock currency,master currency
	public static final String CURRENCY_CODE_REGEX = "^[A-Z]{1,3}$";
	public static final String LOCALE_REGEX = "^[A-Za-z-_#]{5,10}$";
	// @formatter:off
	/**
	 * 01/01 //valid 12/01 //valid 31/01 //invalid 01/32 //invalid
	 */
	// @formatter:on
	public static final String MM_DD_FORMAT_REGEX = "^(0?[1-9]|1[0-2]){1}\\/(0?[1-9]|1[0-9]|2[0-9]|3[0-1]){1}$";
	// @formatter:off
	/**
	 * JAN //valid Jan //invalid January //invalid DEC //valid
	 */
	// @formatter:on
	public static final String MMM_FORMAT_REGEX = "^[JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC]{3}$";
	// location related regEx ends here

	// product related regEx starts here
	public static final String ITEM_CODE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String THEME_CODE_REGEX = "^[A-Z0-9]{1,7}$";
	public static final String LOT_NUMBER_REGEX = "^[A-Z0-9_]{1,12}$";
	public static final String PRODUCT_GROUP_CODE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String PRODUCT_GROUP_PLAIN_STUDDED_REGEX = "^[O|P|S]{1}$";
	public static final String PRODUCT_CATEGORY_CODE_REGEX = ALPHA_NUMERIC_REGEX_WITH_SPACE_MAX_20;

	// sub_brand should be used this regEx
	public static final String BRAND_CODE_REGEX = "^[A-Za-z0-9 ]{1,20}$";
	public static final String ITEM_TYPE_CODE_REGEX = "^[A-Z]{1,6}$";
	public static final String MATERIAL_TYPE_CODE_REGEX = "^[A-Z]{1,6}$";
	public static final String COMPLEXITY_CODE_REGEX = "^[A-Za-z0-9- \\/&]{1,20}$";
	public static final String PRICE_GROUP_REGEX = "^[A-Za-z0-9- \\/&]{1,20}$";
    public static final String WASTAGE_PCT_REGEX = "^[\\d]*[\\.]?[\\d]*$";
	public static final String PRODUCT_TYPE_REGEX = ALPHA_REGEX_MAX_50;
	public static final String STONE_CODE_REGEX = "^[0-9A-Za-z- ]{1,20}$";
	public static final String STONE_SHAPE_REGEX = "^[A-Z- .]{1,20}$"; // -, space, dot
	public static final String STONE_QUALITY_REGEX = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,20}$";
	public static final String STONE_TYPE_CODE_REGEX = "^[A-Z]{2,20}$";
	public static final String PRICING_TYPE = "^[A-Za-z_]{1,20}$";

	// FINDING,PRICINGGROUPTYPE,PRICINGTYPE,PRODUCTTYPE,SUPPLYCHAIN ---------> LOV
	// types
	public static final String PRODUCT_LOV_CODE_REGEX = "^[A-Z0-9-+]{1,50}$";
	public static final String PRODUCT_LOV_VALUE_REGEX = "^[A-Za-z0-9-+ .]{1,50}$";
	public static final String MARKUP_FACTOR_REGEX = "^(0(\\.\\d+)?|1(\\.0+)?)$";
	public static final String METAL_TYPE_REGEX = "^[A-Z]{1,2}$";
	// product related regEx ends here

	// customer related regEx starts here

	// REGEX for customer name
	public static final String NAME_REGEX = "^(?!.*([A-Za-z'.\\s])\\1{2})[A-Za-z][A-Za-z'.\\s]{1,49}$";
	public static final String REFUND_NAME_REGEX = "^(?!.*([A-Za-z'.\\s])\\1{2})[A-Za-z][A-Za-z'.\\s]{1,149}$";
	public static final String INSTI_NAME_REGEX = "^(?!.*([A-Za-z0-9'.\\s()])\\1{2})[A-Za-z0-9][A-Za-z0-9'.\\s()]{1,49}$";
	public static final String EMAIL_REGEX = "^(?i)[A-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@.+\\..+$";
	public static final String PAN_REGEX = "^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$";
	public static final String GST_REGEX = "^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}$";
	public static final String MOBILE_REGEX = "^(?:[0-9]){6,14}$"; // for international mobile number
	public static final String IND_MOBILE_REGEX = "^[6-9][0-9]{9}$"; // for Indian mobile number
	public static final String EMAIL_REGEX_WO_CORP = "^(?i)[A-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@(?!titan\\..+$).+\\..+$";
	public static final String TELEPHONE_REGEX = "^[0-9][0-9-]{2,18}[0-9]$";
	public static final String CATCHMENT_CODE_REGEX = WORD_REGEX_MAX_20;
	public static final String CATCHMENT_NAME_REGEX = "^.{1,50}$";
	public static final String ULP_ID_REGEX = "^[37][0-9]{11}$";
	public static final String CUSTOMER_ID_REGEX = "^[1-9][0-9]*{5}$";
	public static final String ULP_SEARCH_REGEX = "^([37][0-9]{11}|\\d{10})?$";
	public static final String GIFT_CARD_NUMBER_REGEX = "^\\d{16}$|^\\d{10}$";
	public static final String TRACK_DATA_REGEX = "^\\d{26}$";
	public static final String GIFT_CARD_PIN_REGEX = "^\\d{6}$";

	// can be mobile or telephone number
	public static final String TELE_MOBILE_NO_REGEX = "^(?:[0-9]){6,14}|[0-9\\-]{10,20}$";

	// for mobile, email, GST or PAN search
	public static final String ALPHANUMERIC_OR_EMAIL_REGEX = ALPHA_NUMERIC_REGEX + "|" + EMAIL_REGEX;

	public static final String SALES_LOV_CODE_REGEX = "^[A-Za-z0-9][\\w\\/\\%]{0,49}";
	public static final String SALES_LOV_VALUE_REGEX = "^[A-Za-z0-9][A-Za-z0-9 &\\/\\-\\%.]{0,49}";

	// customer related regEx ends here

	// payment related regex starts here
	public static final String PAYMENT_CODE_REGEX = ALPHA_NUMERIC_REGEX_MAX_30;
	public static final String CARD_DIGITS_REGEX = "^\\d+(,\\d+)*$";
	public static final String DEVICE_ID_REGEX = "^[A-Z0-9]{8}$";
	public static final String CASHBACK_NAME_REGEX = "^[A-Za-z0-9 ]{1,50}$";
	public static final String CARD_NO_LENGTH_REGEX = "^[0-9]{6,20}$";
	public static final String BANK_NAME_REGEX = "^[A-Za-z0-9][A-Za-z0-9&\\-\\(\\)\\.\\,\\' ]{0,49}$";
	// payment related regex ends here

	// inventory related regEx starts here
	public static final String ROAD_PERMIT_REGEX = "^[A-Za-z0-9-\\/_& ]{1,30}$";
	public static final String UUID_REGEX = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
	public static final String REASON_REGEX = ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_250;
	public static final String REMARKS_REGEX = ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_250;

	// for courier name
	public static final String COURIER_NAME_REGEX = "^[a-zA-Z ]{1,100}$";
	public static final String BIN_REGEX = "^[A-Za-z0-9 ]{1,25}$";
	public static final String BIN_GROUP_REGEX = "^[A-Z0-9 ]{1,25}$";
	public static final String COURIER_DOC_REGEX = "^[0-9]{1,30}$";
	public static final String STATE_REGEX = "^[A-Za-z& ]{1,30}$";
	public static final String ERP_INVOICE_NUMBER_REGEX = "^[A-Z]{5}[0-9]{5,10}$";
	// inventory related regEx ends here

	// user related regEx starts here
	public static final String ACL_REGEX = "[A-Z]{1}[0-9]{0,3}";
	public static final String EMPCODE_REGEX = "^[0-9a-zA-Z][\\w.]{0,14}$";
	public static final String USER_NAME_REGEX = "^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$";
	public static final String EMPCODE_OR_NAME = EMPCODE_REGEX + "|" + USER_NAME_REGEX;
	public static final String USER_LOV_CODE_REGEX = ALPHA_NUMERIC_REGEX_MAX_50;
	public static final String USER_LOV_VALUE_REGEX = ALPHA_NUMERIC_REGEX_MAX_50;
	public static final String DESIGNATION_REGEX = "^[A-Za-z0-9-\\/_.& ]{1,30}$";
	public static final String ACCESS_TYPE_REGEX = "^[0-1]{5,10}";
	public static final String ROLE_DESCRIPTION_REGEX_MAX_100 = "^[\\w ?\\\\%\\/\\(\\)\\[\\],&-.\"#'@+<=>:]{1,250}$";

	public static final String PSWD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[\\t \\\\~<])(?=.*[_\\-+=!@%*&\":.\\/>'#$^])(.{8,32})$";
	public static final String PSWD_REGEX_VAR = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[\\t \\\\~<])(?=.*[_\\-+=!@%*&\":.\\/>'#$^])(.{#MIN,#MAX})$";

	public static final String ROLE_CODE_REGEX = "^[A-Za-z0-9 -\\/&]{1,20}$";
	// user related regEx ends here

	// auth related regEx starts here
	public static final String GRANT_TYPE_REGEX = "^\\w{1,20}$";
	public static final String REFRESH_TOKEN_REGEX = "^[0-9a-fA-F]{32}$";
	// auth related regEx ends here

	// configuration related regEx starts here
	public static final String CONFIG_FIELD_CODE_REGEX = "^[A-Z_]{1,50}$";
	public static final String DISCOUNT_CODE_REGEX = "^.{1,50}$";
	public static final String DISCOUNT_TYPE_REGEX = ALPHABETS_WITH_SPACE_REGEX;
	public static final String DECIMAL_REGEX = "^\\d+(\\.\\d+)?$";
	public static final String RULE_FIELD_CODE_REGEX = NUMERIC_REGEX;
	public static final String GEP_ITEM_TYPE_REGEX = "^[A-Z]{1,10}$";
	public static final String FOC_SCHEME_NAME_REGEX = DESCRIPTION_REGEX_SPCL_CHAR_MAX_50;
	public static final String AIRPAY_MERCHANT_ID_REGEX = "^\\d{1,12}$";
	public static final String AIRPAY_USERNAME_REGEX = "^\\d{7}$";
	public static final String AIRPAY_PASS_WORD_REGEX = "^[a-zA-Z0-9]{8}$";
	public static final String AIRPAY_SECRET_KEY_REGEX = "^[a-zA-Z0-9]{16}$";
	public static final String AIRPAY_SECRET_TOKEN_REGEX = "^[a-zA-Z0-9]{15}$";
	public static final String QCGC_TERMINAL_ID_REGEX = "^[A-Za-z0-9:\\-_]{1,30}$";
	public static final String COMMA_SEPERATED_INTEGER_VALUES = "^(?:[0-9]+,)*[0-9]+$";

	// configuration related regEx ends here

	// Scheduler related regEx starts here
	// regEx will vary based on fileGroup(STN,INVOICE,FIR,MER)
	public static final String FILE_NAME_REGEX = "^[a-zA-Z][a-zA-Z0-9_.]{0,200}\\.[a-zA-Z0-9]{1,10}$";
	public static final String FILE_NAME_REGEX_GHS = "^[a-zA-Z][a-zA-Z0-9_.-]{0,200}\\.[a-zA-Z0-9]{1,10}$";
	// Scheduler realated regEx ends here

	// Sales related regex starts here
	public static final String TRACK_DATA_OR_PIN_REGEX = "^\\d{6}$|^\\d{26}$";
	public static final String OTP_REGEX = "^\\d{6}$";
	// Sales related regex ends here

	// Reports related regex starts here
	public static final String REPORT_NAME_REGEX = ALPHA_NUMERIC_SPACE_REGEX_50;
	public static final String REPORT_TYPE_REGEX = ALPHA_NUMERIC_REGEX_MAX_50;

	// 09:00 ----valid
	// 09:30 ----valid
	// 30:09 ----invalid
	// 10:60 ----invalid
	public static final String ACCESS_TIME_REGEX = "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$";
	public static final String FIELD_NAME_REGEX = "^[A-Za-z0-9\\-\\/ ]{1,50}$";
	public static final String TEMPLATE_NAME_REGEX = ALPHA_NUMERIC_REGEX_MAX_50;
	public static final String QUERY_NAME_REGEX = ALPHA_NUMERIC_REGEX_MAX_50;
	public static final String FIELD_TYPE_REGEX = ALPHA_NUMERIC_REGEX_MAX_20;
	// Reports related regex ends here

	// regex to be used for masking card number
	public static final String REGEX_TO_MASK_CARD_NO = "(?<=.{4}).(?=.{4})";

	// Regex to be used for Workflow Request Expiry Global Configuration
	public static final String WORKFLOW_REQEXPIRE_GLOBAL_CONFIG_REGEX = "^[0-9]{1,4}$";

}