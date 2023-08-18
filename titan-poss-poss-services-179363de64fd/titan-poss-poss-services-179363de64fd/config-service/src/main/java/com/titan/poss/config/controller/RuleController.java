/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.controller;

import static com.titan.poss.config.dto.constants.ConfigConstants.RULE_CONTROLLER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.config.dto.RuleProductUpdateDto;
import com.titan.poss.config.dto.request.MappedRuleLocationDto;
import com.titan.poss.config.dto.request.RivaahProductMappingDto;
import com.titan.poss.config.dto.request.RuleLocationUpdateDto;
import com.titan.poss.config.dto.request.RuleMasterUpdateDto;
import com.titan.poss.config.dto.request.RuleRangeDto;
import com.titan.poss.config.dto.request.RuleRequestMappingListDto;
import com.titan.poss.config.dto.request.UpdateMarketMappingDto;
import com.titan.poss.config.dto.response.MarketMappingResponseDto;
import com.titan.poss.config.dto.response.RivaahProductMappingResponse;
import com.titan.poss.config.dto.response.RivaahRuleLocationDto;
import com.titan.poss.config.dto.response.RuleLocationDto;
import com.titan.poss.config.dto.response.RuleMasterDto;
import com.titan.poss.config.dto.response.RuleMasterResponseDto;
import com.titan.poss.config.dto.response.RuleProductDetailsDto;
import com.titan.poss.config.dto.response.RuleRangeResponseDto;
import com.titan.poss.config.service.RuleService;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.RivaahLocationFilterDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(RULE_CONTROLLER)
@RequestMapping("config/v2/rule-types")
public class RuleController {

	// @formatter:off
	private static final String CONFIGURE_PERMISSION_ADD_EDIT = "hasPermission(#ruleType,'IBT_CONFIGURATIONS')" + AND + START
			+ ConfigAccessControls.IBT_RULETYPE_ADD_EDIT + END + OR + "hasPermission(#ruleType,'WEIGHT_TOLERANCE')" + AND + START
			+ ConfigAccessControls.WEIGHT_TOL_RULETYPE_ADD_EDIT + END + OR + "hasPermission(#ruleType,'CONVERSIONS')" + AND + START
			+ ConfigAccessControls.CONVERSIONS_RULETYPE_ADD_EDIT + END + OR + "hasPermission(#ruleType,'INVOICE_CONFIGURATIONS')" + AND + START
			+ ConfigAccessControls.INVOICE_RULETYPE_ADD_EDIT + END + OR + "hasPermission(#ruleType,'HISTORY_TIME_CONFIGURATION')" + AND
			+ START + ConfigAccessControls.HISTORY_TIME_RULETYPE_ADD_EDIT + END 
			+ OR + "hasPermission(#ruleType,'CASH_CONFIGURATION')" + AND + START + ConfigAccessControls.CASH_PAYMENT_RULETYPE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GRF_CONFIGURATION')" + AND + START + ConfigAccessControls.GRF_TOLERANCE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GRN_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.GRN_TOLERANCE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.AB_TOLERANCE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.AB_TOLERANCE_RESIDUAL_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'CN_PRIORITY_CONFIG')" + AND + START + ConfigAccessControls.CN_PRIORITY_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'TEP')" + AND + START + ConfigAccessControls.CN_TEP_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GRN')" + AND + START + ConfigAccessControls.CN_GRN_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GHS')" + AND + START + ConfigAccessControls.CN_GHS_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'EVOUCHER')" + AND + START + ConfigAccessControls.CN_GHS_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GEP')" + AND + START + ConfigAccessControls.CN_GEP_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'CN_IBT')" + AND + START + ConfigAccessControls.CN_IB_CN_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'BILL_CANCELLATION')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ADV')" + AND + START + ConfigAccessControls.CN_ADV_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_PAYMENT_CONFIG')" + AND + START + ConfigAccessControls.ORDER_AB_PAYMENT_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GRN_INTER_OWNER_TYPE')" + AND + START + ConfigAccessControls.GRN_INTER_OWNER_TYPE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'BGR_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.BGR_TOLERANCE_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GRN_APPROVAL_ACCESS_REGULAR')" + AND + START + ConfigAccessControls.GRN_APPROVAL_ACCESS_REGULAR_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'GRN_APPROVAL_ACCESS_MFG_DEFECT')" + AND + START + ConfigAccessControls.GRN_APPROVAL_ACCESS_MFG_DEFECT_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_BGR_CONFIG')" + AND + START + ConfigAccessControls.BGR_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'WORKFLOW_REQEXPIRE_GLOBAL_CONFIG')" + AND + START + ConfigAccessControls.WORKFLOW_REQEXPIRE_GLOBAL_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_NON_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.AB_TOLERANCE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'FTEP_APPROVAL_ACCESS_REGULAR')" + AND + START + ConfigAccessControls.FTEP_APPROVAL_ACCESS_REGULAR_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'DIGI_GOLD_TANISHQ')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'DIGI_GOLD_NON_TANISHQ')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'TCS_CREDIT_NOTE')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'AMENDMENT_CONFIGURATION')" + AND + START + ConfigAccessControls.AMENDMENT_RULETYPE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'RIVAAH_CARD_ELIGIBILITY')" + AND + START + ConfigAccessControls.FTEP_APPROVAL_ACCESS_REGULAR_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.CO_TOLERANCE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_NON_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.CO_TOLERANCE_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.CO_TOLERANCE_RESIDUAL_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_PAYMENT_CONFIG')" + AND + START + ConfigAccessControls.ORDER_CO_PAYMENT_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_BGR_CONFIG')" + AND + START + ConfigAccessControls.BGR_CONFIG_ADD_EDIT + END
			+ OR + "hasPermission(#ruleType,'BGR_CO_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.BGR_TOLERANCE_CONFIG_ADD_EDIT + END;
	
		
	private static final String CONFIGURE_PERMISSION_VIEW = "hasPermission(#ruleType,'IBT_CONFIGURATIONS')" + AND + START
			+ ConfigAccessControls.IBT_RULETYPE_VIEW + END + OR + "hasPermission(#ruleType,'WEIGHT_TOLERANCE')" + AND + START
			+ ConfigAccessControls.WEIGHT_TOL_RULETYPE_VIEW + END + OR + "hasPermission(#ruleType,'CONVERSIONS')" + AND + START
			+ ConfigAccessControls.CONVERSIONS_RULETYPE_VIEW + END + OR + "hasPermission(#ruleType,'INVOICE_CONFIGURATIONS')" + AND + START
			+ ConfigAccessControls.INVOICE_RULETYPE_VIEW + END + OR + "hasPermission(#ruleType,'HISTORY_TIME_CONFIGURATION')" + AND
			+ START + ConfigAccessControls.HISTORY_TIME_RULETYPE_VIEW + END 
			+ OR + "hasPermission(#ruleType,'CASH_CONFIGURATION')" + AND + START + ConfigAccessControls.CASH_PAYMENT_RULETYPE_VIEW + END
			+ OR + "hasPermission(#ruleType,'GRF_CONFIGURATION')" + AND + START + ConfigAccessControls.GRF_TOLERANCE_VIEW + END
			+ OR + "hasPermission(#ruleType,'GRN_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.GRN_TOLERANCE_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.AB_TOLERANCE_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.AB_TOLERANCE_RESIDUAL_VIEW + END
			+ OR + "hasPermission(#ruleType,'CN_PRIORITY_CONFIG')" + AND + START + ConfigAccessControls.CN_PRIORITY_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'TEP')" + AND + START + ConfigAccessControls.CN_TEP_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'GRN')" + AND + START + ConfigAccessControls.CN_GRN_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'GHS')" + AND + START + ConfigAccessControls.CN_GHS_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'EVOUCHER')" + AND + START + ConfigAccessControls.CN_GHS_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'GEP')" + AND + START + ConfigAccessControls.CN_GEP_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'CN_IBT')" + AND + START + ConfigAccessControls.CN_IB_CN_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'BILL_CANCELLATION')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'ADV')" + AND + START + ConfigAccessControls.CN_ADV_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_PAYMENT_CONFIG')" + AND + START + ConfigAccessControls.ORDER_AB_PAYMENT_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'GRN_INTER_OWNER_TYPE')" + AND + START + ConfigAccessControls.GRN_INTER_OWNER_TYPE_VIEW + END
			+ OR + "hasPermission(#ruleType,'BGR_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.BGR_TOLERANCE_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'GRN_APPROVAL_ACCESS_REGULAR')" + AND + START + ConfigAccessControls.GRN_APPROVAL_ACCESS_REGULAR_VIEW + END
			+ OR + "hasPermission(#ruleType,'GRN_APPROVAL_ACCESS_MFG_DEFECT')" + AND + START + ConfigAccessControls.GRN_APPROVAL_ACCESS_MFG_DEFECT_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_BGR_CONFIG')" + AND + START + ConfigAccessControls.BGR_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'WORKFLOW_REQEXPIRE_GLOBAL_CONFIG')" + AND + START + ConfigAccessControls.WORKFLOW_REQEXPIRE_GLOBAL_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_AB_NON_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.AB_TOLERANCE_VIEW + END
			+ OR + "hasPermission(#ruleType,'FTEP_APPROVAL_ACCESS_REGULAR')" + AND + START + ConfigAccessControls.FTEP_APPROVAL_ACCESS_REGULAR_VIEW + END
			+ OR + "hasPermission(#ruleType,'DIGI_GOLD_TANISHQ')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'DIGI_GOLD_NON_TANISHQ')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'TCS_CREDIT_NOTE')" + AND + START + ConfigAccessControls.CN_BC_VALIDATION_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'AMENDMENT_CONFIGURATION')" + AND + START + ConfigAccessControls.AMENDMENT_RULETYPE_VIEW + END
			+ OR + "hasPermission(#ruleType,'RIVAAH_CARD_ELIGIBILITY')" + AND + START + ConfigAccessControls.FTEP_APPROVAL_ACCESS_REGULAR_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.CO_TOLERANCE_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_NON_FROZEN_TOLERANCE')" + AND + START + ConfigAccessControls.CO_TOLERANCE_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.CO_TOLERANCE_RESIDUAL_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_PAYMENT_CONFIG')" + AND + START + ConfigAccessControls.ORDER_CO_PAYMENT_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'ORDER_CO_BGR_CONFIG')" + AND + START + ConfigAccessControls.BGR_CONFIG_VIEW + END
			+ OR + "hasPermission(#ruleType,'BGR_CO_TOLERANCE_CONFIG')" + AND + START + ConfigAccessControls.BGR_TOLERANCE_CONFIG_VIEW + END;
	// @formatter:on

	@Autowired
	RuleService ruleService;

	/**
	 * This method will save the Rule details.
	 * 
	 * @param ruleType
	 * @param ruleMasterDto
	 * @return configMasterDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to Save the Rule for RuleType", notes = "This API creates rule details for a given **RuleType** <br><br>"
			+ "<b><span style=\"font-size:14px;\">RuleTypes</span></b>"
			+ "<ul>"
			+ "	<li>WEIGHT_TOLERANCE</li>"
			+ "	<li>HISTORY_TIME_CONFIGURATION</li>"
			+ "	<li>IBT_CONFIGURATIONS</li>"
			+ "	<li>CONVERSIONS</li>"
			+ "	<li>CASH_CONFIGURATION</li>"
			+ " <li>ORDER_AB_PAYMENT_CONFIG</li>"
			+ "</ul><br>"
			+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks for Rule Details Json Format at Header Level:</span></b>\r\n" 
			+
			"<ul>" +
			 "	<li>WEIGHT_TOLERANCE" +
					" - {}\r\n" + 
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
			"  </li>" +
			"	<li>" +
					"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GRNToleranceConfig.json/\">"+
					" GRN_TOLERANCE_CONFIG"+
					"</a>"+
					"</br></br>" +
			"  </li>" +
			"	<li>" +
					"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/IBTDetails.json/\">"+
					"IBT_CONFIGURATIONS"+
					"</a>"+ 
					"</br></br>" +
			"  </li>" +
			"	<li>CONVERSIONS" +
					" - {}\r\n" + 
					"</br></br>" +
				"  </li>" +
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
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/WorkflowRequestExpireGlobalConfig.json/\">"+
			" WORKFLOW_REQEXPIRE_GLOBAL_CONFIG"+
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
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BGRConfig.json/\">"+
			" ORDER_AB_BGR_CONFIG"+
			"</a>"+
			"</br></br>" +
		"  </li>" 	
		+
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BGRConfig.json/\">"+
			" ORDER_CO_BGR_CONFIG"+
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
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/AmendmentConfiguration.json/\">"+
			" AMENDMENT_CONFIGURATION"+
			"</a>"+
			"</br></br>" +
		"  </li>"
		+ 
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/"
		+ "com/titan/poss/config/json/OrderRangeConfig.json/\">"+
			" ORDER_CO_FROZEN_TOLERANCE"+
			"</a>"+
			"</br></br>" +
		"  </li>"
		+ 
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/"
		+ "titan/poss/config/json/OrderRangeConfig.json/\">"+
			" ORDER_CO_NON_FROZEN_TOLERANCE"+
			"</a>"+
			"</br></br>" +
		"  </li>"
		+ 
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/"
		+ "titan/poss/config/json/OrderRangeConfig.json/\">"+
			"ORDER_CO_RESIDUAL_TOLERANCE_CONFIG "+
			"</a>"+
			"</br></br>" +
		"  </li>"
		+ 
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/"
		+ "titan/poss/config/json/OrderPaymentCOConfigDetails.json/\">"+
			"ORDER_CO_PAYMENT_CONFIG "+
			"</a>"+
			"</br></br>" +
		"  </li>"
		+ 
		"	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BGRToleranceRangeConfig.json/\">"+
			" BGR_CO_TOLERANCE_CONFIG"+
			"</a>"+
			"</br></br>" +
		"  </li>"
			)
	// @formatter:on
	@PostMapping(value = "{ruleType}/rules")
	@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public RuleMasterResponseDto createRules(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,GRF_CONFIGURATION,CN_PRIORITY_CONFIG,TEP,GRN,GHS,GEP,"
					+ "CN_IBT,BILL_CANCELLATION,ADV,ORDER_AB_PAYMENT_CONFIG,GRN_INTER_OWNER_TYPE, GRN_TOLERANCE_CONFIG, "
					+ "ORDER_AB_FROZEN_TOLERANCE,ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,BGR_TOLERANCE_CONFIG, GRN_APPROVAL_ACCESS_REGULAR,"
					+ " GRN_APPROVAL_ACCESS_MFG_DEFECT,ORDER_AB_BGR_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,WORKFLOW_REQEXPIRE_GLOBAL_CONFIG, "
					+ "FTEP_APPROVAL_ACCESS_REGULAR,DIGI_GOLD_TANISHQ,DIGI_GOLD_NON_TANISHQ,TCS_CREDIT_NOTE,"
					+ "AMENDMENT_CONFIGURATION ,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Valid @RequestBody RuleMasterDto ruleMasterDto) {

		return ruleService.createRules(ruleType, ruleMasterDto);

	}

	/**
	 * This method will return the Rule details based on the RuleType and RuleId.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return RuleMasterResponseDto
	 */
	@ApiOperation(value = "API to get the Rule details based on the RuleType and RuleId", notes = "This API returns the Rule details based on the **RuleType and RuleId**")
	@GetMapping(value = "/{ruleType}/rules/{ruleId}")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public RuleMasterResponseDto getConfigDetails(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,GRF_CONFIGURATION,CN_PRIORITY_CONFIG,TEP,GRN,GHS,GEP,"
					+ "	CN_IBT,BILL_CANCELLATION,ADV,ORDER_AB_PAYMENT_CONFIG,GRN_INTER_OWNER_TYPE, GRN_TOLERANCE_CONFIG, "
					+ "ORDER_AB_FROZEN_TOLERANCE, ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,BGR_TOLERANCE_CONFIG, GRN_APPROVAL_ACCESS_REGULAR, "
					+ "GRN_APPROVAL_ACCESS_MFG_DEFECT,ORDER_AB_BGR_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,WORKFLOW_REQEXPIRE_GLOBAL_CONFIG,"
					+ "FTEP_APPROVAL_ACCESS_REGULAR, RIVAAH_CARD_ELIGIBILITY,DIGI_GOLD_TANISHQ,DIGI_GOLD_NON_TANISHQ,TCS_CREDIT_NOTE,"
					+ "AMENDMENT_CONFIGURATION,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId) {

		return ruleService.getRuleDetails(ruleType, ruleId);

	}

	/**
	 * This method will update the Rule details based on the RuleType and RuleId.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return RuleMasterResponseDto
	 */
	@ApiOperation(value = "API to Update the Rule details based on the RuleType and ruleId", notes = "This API updates the Rule details based on the **RuleType and RuleId**")
	@PatchMapping(value = "/{ruleType}/rules/{ruleId}")
	@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public RuleMasterResponseDto updateRuleDetails(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,GRF_CONFIGURATION,ORDER_AB_PAYMENT_CONFIG,CN_PRIORITY_CONFIG,TEP,GRN,GHS,"
					+ "GEP,GRN_INTER_OWNER_TYPE, GRN_TOLERANCE_CONFIG, ORDER_AB_FROZEN_TOLERANCE,ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,BGR_TOLERANCE_CONFIG,ADV,"
					+ "GRN_APPROVAL_ACCESS_REGULAR, GRN_APPROVAL_ACCESS_MFG_DEFECT,ORDER_AB_BGR_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,"
					+ "WORKFLOW_REQEXPIRE_GLOBAL_CONFIG,FTEP_APPROVAL_ACCESS_REGULAR, RIVAAH_CARD_ELIGIBILITY,"
					+ "AMENDMENT_CONFIGURATION,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@Valid @RequestBody RuleMasterUpdateDto ruleMasterUpdateDto) {

		return ruleService.updateRuleDetails(ruleType, ruleId, ruleMasterUpdateDto);

	}

	/**
	 * This method will create/remove mapping between rules and location.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @param ruleLocationDto
	 * @return RuleLocationDto
	 */

	@ApiOperation(value = "Create/Remove/Overwrite Mapping between Rule Id and locations", notes = "This API creates/removes Mapping between RuleId and locations"
			+ "</br></br>It takes the following inputs:</br>"
			+ "</br></t> addLocations: locationCodes will be mapped to respected RuleId & RuleType</br>"
			+ "</br></t> overwriteLocations : already mapped locations will be overwritten and locationCodes will be mapped to respected RuleId & RuleType\r\n"
			+ "</br></t> removeLocations: will delete the locations mapped to ruleType and ruleID - hard delete</br>")
	@PatchMapping(value = "/{ruleType}/rules/{ruleId}/locations")
	@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public RuleLocationUpdateDto ruleLocationMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,"
					+ "GRF_CONFIGURATION,CN_PRIORITY_CONFIG,TEP,GRN,GHS,GEP,"
					+ "	CN_IBT,BILL_CANCELLATION,ADV,ORDER_AB_PAYMENT_CONFIG,GRN_INTER_OWNER_TYPE, GRN_TOLERANCE_CONFIG, "
					+ "ORDER_AB_FROZEN_TOLERANCE,ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,BGR_TOLERANCE_CONFIG, GRN_APPROVAL_ACCESS_REGULAR, "
					+ "GRN_APPROVAL_ACCESS_MFG_DEFECT,ORDER_AB_BGR_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,WORKFLOW_REQEXPIRE_GLOBAL_CONFIG,"
					+ "FTEP_APPROVAL_ACCESS_REGULAR,RIVAAH_CARD_ELIGIBILITY,DIGI_GOLD_TANISHQ,DIGI_GOLD_NON_TANISHQ,"
					+ "TCS_CREDIT_NOTE,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@RequestBody @Valid RuleLocationUpdateDto ruleLocationUpdateDto) {
		return ruleService.ruleLocationMapping(ruleType, ruleId, ruleLocationUpdateDto);

	}

	@ApiPageable
	@ApiOperation(value = "API to get the list of Rule Location mapping details for rivaah configuration", notes = "This API returns the list of Rule location mapping details for rivaah configuration")
	@PostMapping("/{ruleType}/rules/{ruleId}/rivaah")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public PagedRestResponse<List<RivaahRuleLocationDto>> listRivaahLocationMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "RIVAAH_CARD_ELIGIBILITY", required = true) @PathVariable("ruleType") String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@RequestBody @Valid @ApiParam(name = "body", value = "location filter", required = false) RivaahLocationFilterDto locationCodeFilter,
			@ApiIgnore Pageable pageable) {

		return ruleService.listRivaahLocationMapping(ruleType, ruleId, locationCodeFilter, pageable);
	}

	/**
	 * This method will return the list of location codes which is already mapped to
	 * ruleId based on location Codes and ruleType,
	 * 
	 * @param ruleType,
	 * @param ruleId,
	 * @return List<MappedConfigResponseDto>
	 */
	@PostMapping(value = "/{ruleType}/rules/locations")
	@ApiOperation(value = "View the list of Unique location codes and configId which is already mapped to ruleType", notes = "This API returns the list of Unique location codes and configId mapped to ruleType"
			+ "</br></br> It takes the following filters:</br>"
			+ "</br></t> 1. includeLocations: list of locationCodes to be included</br>"
			+ "</br></t> 2. excludeRuleId: ruleId to be excluded</br>")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public ListResponse<RuleLocationDto> getMappedLocationCodes(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,"
					+ "GRF_CONFIGURATION,CN_PRIORITY_CONFIG,TEP,GRN,GHS,GEP,"
					+ "	CN_IBT,BILL_CANCELLATION,ADV,ORDER_AB_PAYMENT_CONFIG,GRN_INTER_OWNER_TYPE, GRN_TOLERANCE_CONFIG, "
					+ "ORDER_AB_FROZEN_TOLERANCE, ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,BGR_TOLERANCE_CONFIG, GRN_APPROVAL_ACCESS_REGULAR, "
					+ "GRN_APPROVAL_ACCESS_MFG_DEFECT, ORDER_AB_BGR_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,WORKFLOW_REQEXPIRE_GLOBAL_CONFIG,"
					+ "FTEP_APPROVAL_ACCESS_REGULAR,DIGI_GOLD_TANISHQ,DIGI_GOLD_NON_TANISHQ,"
					+ "TCS_CREDIT_NOTE,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Valid @RequestBody MappedRuleLocationDto ruleLocationDto) {

		return ruleService.getMappedLocationCodes(ruleType, ruleLocationDto);
	}

	/**
	 * This method will return the list of Rule Location mapping details based on
	 * isActive.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @param isActive
	 * @return ListResponse<RuleLocationDto>
	 */
	@ApiOperation(value = "API to get the list of Rule Location mapping details for a given ruleType and ruleId", notes = "This API returns the list of Rule location mapping details based on RuleType and RuleId")
	@GetMapping("/{ruleType}/rules/{ruleId}/locations")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public ListResponse<RuleLocationDto> listRuleLocationMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,"
					+ "GRF_CONFIGURATION,CN_PRIORITY_CONFIG,TEP,GRN,GHS,GEP,"
					+ "	CN_IBT,BILL_CANCELLATION,ADVANCE,ORDER_AB_PAYMENT_CONFIG,GRN_INTER_OWNER_TYPE, GRN_TOLERANCE_CONFIG, "
					+ "ORDER_AB_FROZEN_TOLERANCE, ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,BGR_TOLERANCE_CONFIG, GRN_APPROVAL_ACCESS_REGULAR, "
					+ "GRN_APPROVAL_ACCESS_MFG_DEFECT, ORDER_AB_BGR_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,WORKFLOW_REQEXPIRE_GLOBAL_CONFIG,"
					+ "FTEP_APPROVAL_ACCESS_REGULAR,RIVAAH_CARD_ELIGIBILITY,DIGI_GOLD_TANISHQ,DIGI_GOLD_NON_TANISHQ,"
					+ "TCS_CREDIT_NOTE,"
					+ "ORDER_CO_FROZEN_TOLERANCE,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_CO_PAYMENT_CONFIG,ORDER_CO_BGR_CONFIG,BGR_CO_TOLERANCE_CONFIG", required = true) @PathVariable("ruleType") String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId) {

		return ruleService.listRuleLocationMapping(ruleType, ruleId);
	}

	/**
	 * This method will create/remove mapping between Rule and Products.
	 * 
	 * @param ruleType
	 * @param configNo
	 * @param ruleProductDto
	 * @return ConfigProductDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to Create/Remove Mapping between rules and products for a RuleType and RuleId", notes = "This API creates/removes Mapping between Rule and ProductGroup, ProductCategory</br>"
			+ "based on RuleType and RuleId"
			+ "</br></t> 1.remove Product will be hard delete based on the Id</br>"
			+ "</br></t> 2.update Product will be updating the details against the uuid generated from adding record</br>"
			+ "</br></t> Can update only Range and RuleDetails for RuleType: <b>WeightTolerance</b></br>"
			+ "</br></t> 3.In Add Product, ProductGroup and ProductCategory will be saved based on ruleId and ruleType.<b>RangeId is null for Conversions</b></br>"
			+ "</br> RuleDetails Object will be Null for All Rules except for RuleType :Conversion & Weight Tolerance </br>"
			+ "</br> It indicates the limits that needs to be set for RuleType \r\n"
			+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks for Rule Details Json Format at Product Level:</span></b>\r\n" +
			 "<ul>" +
			 "	<li>" +
					"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/Weight_Tolerance.json/\">"+
					"WEIGHT_TOLERANCE"+
					"</a>"+
					"</br></br>" +
			"  </li>" +
			"	<li>" +
					"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/Conversions.json/\">"+
					"CONVERSIONS"+
					"</a>"+ 
					"</br></br>"+
			"  </li>" +
			"	<li>" +
					"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderPaymentConfigDetails.json/\">"+
					"ORDER_PAYMENT_CONFIG"+
					"</a>"  
					+"</br></br>" +
			"  </li>"+
			"	<li>" +
			"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderPaymentCOConfigDetails.json/\">"+
			"ORDER_CO_PAYMENT_CONFIG"+
			"</a>"  
			+"</br></br>" +
			"  </li>")
	@PatchMapping(value = "/{ruleType}/rules/{ruleId}/products")
	@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public RuleProductDetailsDto ruleProductGroupMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,"
					+ "CONVERSIONS,HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,ORDER_AB_PAYMENT_CONFIG,RIVAAH_CARD_ELIGIBILITY,"
					+ "ORDER_CO_PAYMENT_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@RequestBody @Valid RuleProductUpdateDto ruleProductDto) {
		return ruleService.ruleProductMapping(ruleType, ruleId, ruleProductDto);

	}

	/**
	 * This method will return the list of Rule Product mapping details based on
	 * RuleType and RuleId.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @return ListResponse<ConfigProductDetailsDto>
	 */
	@ApiPageable
	@ApiOperation(value = "API to get the list of Rule Product mapping details for a RuleType and RuleId", notes = "This API returns the list of Rule Product mapping details based on RuleType and RuleId")
	@GetMapping("/{ruleType}/rules/{ruleId}/products")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public PagedRestResponse<List<RuleProductDetailsDto>> listRuleProductMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,ORDER_AB_PAYMENT_CONFIG,RIVAAH_CARD_ELIGIBILITY,"
					+ "ORDER_CO_PAYMENT_CONFIG", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategoryCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return ruleService.listRuleProductMapping(ruleType, ruleId, productGroupCode, productCategoryCode, isPageable,
				pageable);

	}
	
	
	@ApiOperation(value = "API to map product groups for rivaah eligibility", notes = "This API will map product groups to rivaah eligibility config")
	@PatchMapping(value = "/{ruleType}/rules/{ruleId}/rivaah")
	@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public ListResponse<RivaahProductMappingResponse> rivaahProductMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "RIVAAH_CARD_ELIGIBILITY", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@ApiParam(name = "productId", value = "product id", required = true) @RequestParam(name = "productId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String productId,
			@RequestBody @Valid RivaahProductMappingDto rivaahProductDto) {
		return ruleService.rivaahProductMapping(ruleType, ruleId, productId, rivaahProductDto);

	}

	@ApiOperation(value = "API to get the list of rivaah Product mapping details for eligibility config", notes = "This API returns the list of rivaah Product mapping details based eligibility config")
	@GetMapping("/{ruleType}/rules/{ruleId}/rivaah")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public ListResponse<RivaahProductMappingResponse> listRivaahProductMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "RIVAAH_CARD_ELIGIBILITY", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@ApiParam(name = "productId", value = "product id", required = true) @RequestParam(name = "productId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String productId) {
		return ruleService.listRivaahProductMapping(ruleType, ruleId, productId);
	}


	/**
	 * This method will return the list of Rule Details.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @param ruleRequestMappingListDto
	 * @return PagedRestResponse<RuleMasterDto>
	 */
	@ApiPageable
	@ApiOperation(value = "API to get the list of Rules based on Filters", notes = "This API returns the list of Rules based on Filters applied.Response will be pageable</br>"
			+ " **ruleId,configDescription ,LocationCode ,ProductGroupCode & ProductCategoryCode, ruleGroup, ruleType** are search parameter and all are optional.</br>"
			+ "Allowed RuleGroups: INVENTORY_CONFIGURATION, CN_PRIORITY_CONFIG, CN_VALIDATION_CONFIG, GLOBAL_CONFIGURATION, SALES_CONFIGURATION, "
			+ "ORDER_CONFIGURATION</br>")
	@PostMapping("/details")
	//@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public PagedRestResponse<List<RuleMasterResponseDto>> listConfigDetailsBasedOnFilters(
			@RequestBody(required = false) @Valid RuleRequestMappingListDto ruleRequestMappingListDto,
			@RequestParam(required = false,defaultValue = "false") Boolean isExactSearch,
			@ApiIgnore Pageable pageable) {
		return ruleService.listRuleDetailsBasedOnFilters(ruleRequestMappingListDto, isExactSearch,  pageable);
	}
	
	@ApiOperation(value = "API to add/remove market mapping for a RuleType and RuleId", notes = "This API returns the added Market mapping for a RuleType and RuleId")
	@PatchMapping("/{ruleType}/rules/{ruleId}/markets")
	@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public ListResponse<MarketMappingResponseDto> updateMarketMapping(@ApiParam(value = "Select RuleType", allowableValues = "", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType, @Positive @PathVariable(value = "ruleId", required = true) Integer ruleId, @RequestBody UpdateMarketMappingDto updateMarketMappingDto) {
		return ruleService.updateMarketMapping(ruleId, ruleType, updateMarketMappingDto);
		
	}
	
	@ApiOperation(value = "API to get the list of market mapping based on ruleId and ruleType", notes = "This API returns the list of Market mapping based on ruleId and ruleType")
	@GetMapping("/{ruleType}/rules/{ruleId}/markets")
	@PreAuthorize(CONFIGURE_PERMISSION_VIEW)
	public ListResponse<MarketMappingResponseDto> listMarketMapping(@ApiParam(value = "Select RuleType", allowableValues = "", required = true) @PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType, @Positive @PathVariable(value = "ruleId", required = true) Integer ruleId) {
		return ruleService.listMarketMapping(ruleId, ruleType);
		
	}

	
	@ApiOperation(value = "API to add/remove Range mapping for a RuleType and RuleId", notes = "This API creates/removes Mapping between RuleType,RuleId and Range</br>"
			+"Range details json can be found in the below link</br>"+
			"	<li>" +
					"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderRangeConfig.json/\">"+
					"ORDER_AB_RESIDUAL_TOLERANCE_CONFIG or ORDER_AB_FROZEN_TOLERANCE or ORDER_AB_NON_FROZEN_TOLERANCE or "
					+ "ORDER_AB_RESIDUAL_TOLERANCE_CONFIG or ORDER_CO_FROZEN_TOLERANCE or ORDER_CO_NON_FROZEN_TOLERANCE"+
					"</a>"  
					+"</br></br>" +
			"  </li>"+
			"	<li>" +
			"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BGRToleranceRangeConfig.json/\">"+
			"BGR_TOLERANCE_CONFIG"+
			"</a>"  
			+"</br></br>" +
			"  </li>"+
			"	<li>" +
			"<a href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BGRToleranceRangeConfig.json/\">"+
			"BGR_CO_TOLERANCE_CONFIG"+
			"</a>"  
			+"</br></br>" +
			"  </li>")
	@PatchMapping(value = "/{ruleType}/rules/{ruleId}/ranges")
	//@PreAuthorize(CONFIGURE_PERMISSION_ADD_EDIT)
	public RuleRangeResponseDto ruleRangeMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,"
					+ "INVOICE_CONFIGURATIONS,CONVERSIONS,HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,"
					+ "ORDER_AB_PAYMENT_CONFIG,ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,ORDER_AB_FROZEN_TOLERANCE,"
					+ "BGR_TOLERANCE_CONFIG,BGR_CO_TOLERANCE_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE", required = true) 
			@PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@RequestBody @Valid RuleRangeDto ruleRangeDto) {
		return ruleService.ruleRangeMapping(ruleType, ruleId, ruleRangeDto);

	}
	
	@ApiPageable
	@ApiOperation(value = "API to get Range mapping for a RuleType and RuleId", notes = "This API return Mapping Between RuleType,RuleId and Range</br>")
	@GetMapping(value = "/{ruleType}/rules/{ruleId}/ranges")
	public  PagedRestResponse<List<RuleRangeResponseDto>> getRuleRangeMapping(
			@ApiParam(value = "Select RuleType", allowableValues = "WEIGHT_TOLERANCE, IBT_CONFIGURATIONS,INVOICE_CONFIGURATIONS,CONVERSIONS,"
					+ "HISTORY_TIME_CONFIGURATION,CASH_CONFIGURATION,ORDER_AB_PAYMENT_CONFIG,ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,"
					+ "ORDER_AB_FROZEN_TOLERANCE,BGR_TOLERANCE_CONFIG,ORDER_AB_NON_FROZEN_TOLERANCE,"
					+ "ORDER_CO_FROZEN_TOLERANCE ,ORDER_CO_NON_FROZEN_TOLERANCE ,ORDER_CO_RESIDUAL_TOLERANCE_CONFIG ,"
					+ "ORDER_CO_PAYMENT_CONFIG,BGR_CO_TOLERANCE_CONFIG" , required = true) 
			@PathVariable("ruleType") @ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive @PathVariable(value = "ruleId", required = true) Integer ruleId,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
				return ruleService.getRuleRangeMapping(ruleType, ruleId,isPageable,pageable);
	
	}
	
}
