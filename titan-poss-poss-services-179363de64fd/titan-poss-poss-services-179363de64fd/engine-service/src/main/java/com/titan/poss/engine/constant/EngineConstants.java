/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EngineConstants {

	/*
	 * Price Engine constants
	 */

	public static final String F1_MATERIAL_TYPE_CODE = "F1";

	public static final String F2_MATERIAL_TYPE_CODE = "F2";

	public static final String NA = "NA";

	public static final String LJ = "LJ"; // multimetals

	public static final String JL = "JL"; // multimetals

	public static final Integer DIVISION_SCALE = 11;

	public static final Integer PERCENT_SCALE = 2;

	public static final Integer VALUE_SCALE = 2;

	public static final Integer WEIGHT_SCALE = 3;

	public static final Integer KARAT_SCALE = 3;

	public static final Integer MAX_KARAT = 24;

	public static final String J = "Gold";

	public static final String COMMA = ",";

	public static final String UCP = "UCP";

	public static final String PJWS = "PJWS";

	public static final String P = "Silver";

	public static final String L = "Platinum";

	public static final String PLAIN = "PLAIN";

	public static final String CARAT = "carat";

	public static final String NON_UCP = "NONUCP";

	public static final String STUDDED = "STUDDED";

	public static final String GOLD_WEIGHT = "goldWeight";

	public static final String STONE_WEIGHT = "stoneWeight";

	public static final String MATERIAL_WEIGHT = "materialWeight";

	public static final String STUDDED_PRICEGROUP = "STUDDED";

	public static final String SILVER_WEIGHT = "silverWeight";

	public static final String PLAIN_STUDDED = "PLAIN_STUDDED";

	public static final String DIAMOND_WEIGHT = "diamondWeight";

	public static final String PLATINUM_WEIGHT = "platinumWeight";

	public static final String WASTAGE_PERCENTAGE = "wastage_percentage";

	public static final String MAKING_CHARGE_PERCENTAGE = "making_charge_percentage";

	public static final String MAKING_CHARGE_PER_GRAM = "making_charge_per_Gram";
	
	public static final String MAKING_CHARGE_PER_UNIT = "making_charge_per_unit";

	public static final String IS_GOLD_PRICE_MANDATORY = "isGoldPriceMandatory";

	public static final String IS_STONE_PRICE_MANDATORY = "isStonePriceMandatory";

	public static final String IS_PLATINUM_PRICE_MANDATORY = "isPlatinumPriceMandatory";

	public static final String IS_SILVER_PRICE_MANDATORY = "isSilverPriceMandatory";

	public static final String IS_MAKING_CHARGE_MANDATORY = "isMakingChargeMandatory";

	public static final String INTEGRATION_EGHS_CREDITNOTE_URL = "api/integration/v2/ghs/credit-notes";

	public static final String LOT_DETAILS_GET_URL = "api/engine/v2/products/items/stones";
	
	public static final String ENGINE_GET_LOT_STONE_API = "api/engine/v2/products/stone-details";

	public static final String VALID_COUPONS_GET_URL = "api/config/v2/discounts/coupons";

	public static final String MAX_COUNT_URL = "api/engine/v2/discounts/maxCount";
	/*
	 * Error Constants
	 */
	public static final String ERR_CORE_023 = "ERR-CORE-023";
	public static final String INVALID_REQUEST_FORMAT = "Invalid Request Format";

	public static final String ERR_PAY_007 = "ERR-PAY-007";

	public static final String ERR_PAY_023 = "ERR-PAY-023";

	public static final String ERR_LOC_001 = "ERR-LOC-001";

	public static final String ERR_LOC_029 = "ERR-LOC-029";

	public static final String ERR_PRO_002 = "ERR-PRO-002";

	public static final String ERR_LOC_030 = "ERR-LOC-030";

	public static final String ERR_LOC_005 = "ERR-LOC-005";

	public static final String ERR_LOC_073 = "ERR-LOC-073";

	public static final String ERR_INV_014 = "ERR-INV-014";

	public static final String ERR_PAY_021 = "ERR-PAY-021";

	public static final String ERR_PAY_024 = "ERR-PAY-024";
	
	public static final String ERR_LOC_074 = "ERR-LOC-074";
	
	public static final String ERR_LOC_075 = "ERR-LOC-075";

	public static final String ERR_PRO_048 = "ERR-PRO-048";

	public static final String NO_CPG_PRODUCT_GROUP_FOUND_FOR_THE_REQUESTED_SEARCH = "No CPG/Product Group found for the requested search";

	public static final String NO_ACTIVE_CASHBACK_AVAILABLE = "No Active Cashback Offers for Current Location";

	public static final String NO_ITEMDETAILS_FOUND = "No Item details found for the requested itemCode";

	public static final String NO_TAXDETAILS_FOUND = "No taxClassCode details found for the requested item code ";

	public static final String NO_LOCATION_FOUND = "No Location details found for the requested locationCode";

	public static final String NO_STATETAXCODE_FOUND = "No State details found for the requested stateTaxCode";

	public static final String NO_CONFIGURATION_FOUND = "No Configuration details found for the requested locationCode";

	public static final String NO_CONFIGURATION_FOUND_FOR_CONFIG_TYPE = "No Configuration details found for the requested ConfigType and LocationCode";

	public static final String IS_SAME_STATE = "IGST bill cannot be raised for customer belonging to same state as store";
	
	public static final String IS_NOT_SAME_STATE = "Customer belongs to different state and IGST is not checked";


	/*
	 * Discount Engine constants
	 */

	/*
	 * Payment Constants
	 */

	public static final String PAYMENT_ENGINE_SERVICE = "RevenueEngineService";

	public static final String PAYMENT_ENGINE_CONTROLLER = "PaymentEngineController";

	public static final String RULE_ENGINE_CONTROLLER = "RuleEngineController";

	public static final String CASH_BACK_ENGINE_CONTROLLER = "CashbackEngineService";

	public static final String CASH_BACK_ENGINE_SERVICE = "CashbackEngineController";

	public static final String CASH_BACK_ENGINE_SERVICE_IMPL = "CashbackServiceImpl";

	/*
	 * Tax Engine Constants
	 */

	public static final String OTHER_CHARGES_TAX = "TC71";

	public static final String TAX_DETAILS = "taxDetails";

	public static final String TAX_COMPONENT = "taxComponenet";

	public static final String IS_UNION_TERRITORY = "isUnionTerritory";

	public static final String SGST = "SGST";

	public static final String UTGST = "UTGST";

	/*
	 * Config Engine Constants
	 */

	public static final String ERR_CONFIG_023 = "ERR-CONFIG-023";

	public static final String NO_ACTIVE_FOC_SCHEME = "No Active FOC Scheme available for this location";

	public static final String ERR_CONFIG_044 = "ERR-CONFIG-044";

	public static final String NO_FOC_SCHEME_FOR_GIVEN_PRODUCT_GROUP_CODE = "No FOC Schemes applicable for given ProductGroupCodes";

	public static final String ERR_CONFIG_045 = "ERR-CONFIG-045";

	public static final String ERR_CONFIG_060 = "ERR-CONFIG-060";

	public static final String NO_ITEMCODES_FOUND_FOR_GIVEN_SCHEME = "No itemCodes found for the given Scheme with given karatage and weight";

	public static final String ERR_ENG_015 = "ERR-ENG-015";
	public static final String ITEM_NOT_PRESENT_IN_INVENTORY = "Item not present in inventory.";

	public static final String ERR_ENG_016 = "ERR-ENG-016";
	public static final String ITEM_NOT_PRESENT_IN_ITEM_MASTER = "Item not present in item master.";

	/*
	 * integration calls constants
	 */
	public static final String LOCATION_SERVICE_URL_OLD = "/v2/metal-types/eposs";
	public static final String LOCATION_SERVICE_URL = "/api/location/v2/metal-types/eposs";

}
