/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import static com.titan.poss.engine.constant.EngineConstants.RULE_ENGINE_CONTROLLER;

import java.math.BigDecimal;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.engine.service.RuleService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(RULE_ENGINE_CONTROLLER)
@RequestMapping(value = "engine/v2/rule-types")
public class RuleController {

	@Autowired
	RuleService ruleService;

	public static final String STORE_USER = "isStoreUser()";

	/**
	 * This method will return the list of Rules and Fieldvalue.
	 * 
	 * @param ruleType
	 * @param ruleRequestListDto
	 * @return ListResponse<Object>
	 */
	// @formatter:off
	@ApiOperation(value = "API to get the list of Rules and RuleValues", notes = "This API returns the list of Rules and RuleValues<br><br>"
			+ "<b><span style=\"font-size:14px;\">Response Format for the RuleTypes can be found under the Data Section of the Response Object</span></b>"
			+
			"<ul>" +
			 "	<li>" +
				"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/Weight_Tolerance.json/\">"+
				"WEIGHT_TOLERANCE"+
				"</a>"+
				"</br></br>" +
		"  </li>" +
			 "	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/HistoryTimeConfiguration.json/\">"+
				" HISTORY_TIME_CONFIGURATION"+
				"</a>"+
				"</br></br>" +
			"  </li>" +
			"	<li>" +
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GRFConfig.json/\">"+
			" GRF_CONFIGURATION"+
			"</a>"+
			"</br></br>" +
			
		"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GRNToleranceConfig.json/\">"+
				" GRN_TOLERANCE_CONFIG"+
				"</a>"+
				"</br></br>" +
	    "  </li>" +
	    "	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderToleranceConfig.json/\">"+
				" ORDER_AB_TOLERANCE_CONFIG or ORDER_AB_RESIDUAL_TOLERANCE_CONFIG"+
				"</a>"+
				"</br></br>" +
		"  </li>" +
		"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BestGoldRateToleranceConfig.json/\">"+
				" BGR_TOLERANCE_CONFIG"+
				"</a>"+
				"</br></br>" +
		"  </li>" +
			"	<li>" +
				"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/IBTDetails.json/\">"+
				"IBT_CONFIGURATIONS"+
				"</a>"+ 
				"</br></br>" +
			"  </li>" +
			"	<li>" +
			"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/Conversions.json/\">"+
			"CONVERSIONS"+
			"</a>"+ 
			"</br></br>"+
			"  </li>"+
		"	<li>" +
			"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CashPayment.json/\">"+
			"CASH_PAYMENT_CONFIGURATION"+
			"</a>"  
			+"</br></br>" +
		"  </li>"
			
			 +
			 "	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNADVValidationConfig.json/\">"+
				" ADVANCE"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
			
			
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNBCValidationConfig.json/\">"+
				" BILL_CANCELLATION"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
				
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNIBCNValidationConfig.json/\">"+
				" CN_IBT"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
				
			
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNGEPValidationConfig.json/\">"+
				" GEP"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
				
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNGHSValidationConfig.json/\">"+
				" GHS"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
				
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNGRNValidationConfig.json/\">"+
				" GRN"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
				
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNTEPValidationConfig.json/\">"+
				" TEP"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
				
			+
			"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CNPriorityConfig.json/\">"+
				" CN_PRIORITY_CONFIG"+
				"</a>"+
				"</br></br>" +
			"  </li>" 

		+
		"	<li>" +
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GRNInterOwnerTypeConfig.json/\">"+
			" GRN_INTER_OWNER_TYPE"+
			"</a>"+
			"</br></br>" +
		"  </li>" 	

		+
		"	<li>" +
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GrnApprovalAccessRegular.json/\">"+
			" GRN_APPROVAL_ACCESS_REGULAR"+
			"</a>"+
			"</br></br>" +
		"  </li>" 	

		+
		"	<li>" +
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GrnApprovalAccessMfgDefect.json/\">"+
			" GRN_APPROVAL_ACCESS_MFG_DEFECT"+
			"</a>"+
			"</br></br>" +
		"  </li>" 
		+
		"	<li>" +
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/WorkflowRequestExpireGlobalConfig.json/\">"+
			" WORKFLOW_REQEXPIRE_GLOBAL_CONFIG"+
			"</a>"+
			"</br></br>" +
		"  </li>" 
		+
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/FtepApprovalAccessRegular.json/\">"+
		" FTEP_APPROVAL_ACCESS_REGULAR"+
		"</a>"+
		"</br></br>" +
		"  </li>" 
		+
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BGRConfig.json/\">"+
			" BGR_CONFIG"+
			"</a>"+
			"</br></br>" +
		"  </li>" 
		+
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderPaymentCOConfigDetails.json/\">"+
			" ORDER_CO_PAYMENT_CONFIG"+
			"</a>"+
			"</br></br>" +
		"  </li>" 
			)
	// @formatter:on
	@PostMapping("/{ruleType}/values")
	public Object ruleValueMappingListBasedOnFilters(
			@PathVariable("ruleType") @ApiParam(value = " Select Rule Type", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS, INVOICE_CONFIGURATIONS, CONVERSIONS, HISTORY_TIME_CONFIGURATION,\r\n"
					+ "	CASH_CONFIGURATION, GRF_CONFIGURATION, GRN_TOLERANCE_CONFIG, ORDER_AB_FROZEN_TOLERANCE,\r\n"
					+ "	ORDER_AB_RESIDUAL_TOLERANCE_CONFIG, CN_PRIORITY_CONFIG, TEP, GRN, GHS, GEP, CN_IBT, BILL_CANCELLATION, ADV,\r\n"
					+ "	ORDER_AB_PAYMENT_CONFIG, GRN_INTER_OWNER_TYPE, BEST_GOLD_RATE, BGR_TOLERANCE_CONFIG, GRN_APPROVAL_ACCESS_REGULAR,\r\n"
					+ "	GRN_APPROVAL_ACCESS_MFG_DEFECT, ORDER_AB_BGR_CONFIG, ORDER_AB_NON_FROZEN_TOLERANCE, WORKFLOW_REQEXPIRE_GLOBAL_CONFIG,"
					+ "RIVAAH_CARD_ELIGIBILITY,FTEP_APPROVAL_ACCESS_REGULAR,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@RequestBody(required = false) @Valid RuleRequestListDto ruleRequestListDto) {

		return ruleService.ruleValueMappingListBasedOnFilters(ruleType, ruleRequestListDto);
	}

//	@PreAuthorize(STORE_USER)
	@GetMapping("validate/weight-tolerance")
	public void checkWeightToleranceValue(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode,
			@RequestParam(required = true) BigDecimal availableWeight,
			@RequestParam(required = true) BigDecimal measuredWeight,
			@RequestParam(required = true) short availableQuantity,
			@RequestParam(required = true) short measuredQuantity) {

		ruleService.checkWeightTolerance(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				productGroupCode, availableWeight, measuredWeight, availableQuantity, measuredQuantity);

	}
	
	@GetMapping("getRefundCashLimit")
	public BigDecimal getRefundCashLimitConfig() {
		return ruleService.getRefundCashLimitConfig();
	}
	
}
