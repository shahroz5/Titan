/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.json.AdvanceCNRuleDetails;
import com.titan.poss.config.dto.request.json.AmendmentRuleDetails;
import com.titan.poss.config.dto.request.json.BGRConfigDetails;
import com.titan.poss.config.dto.request.json.BGRToleranceRangeDetails;
import com.titan.poss.config.dto.request.json.CNRuleDetails;
import com.titan.poss.config.dto.request.json.ConversionRuleDetails;
import com.titan.poss.config.dto.request.json.GrfConfigDetails;
import com.titan.poss.config.dto.request.json.GrnToleranceConfigDetails;
import com.titan.poss.config.dto.request.json.HistoryTimeRuleDetails;
import com.titan.poss.config.dto.request.json.IbtRuleDetails;
import com.titan.poss.config.dto.request.json.OrderPaymentConfigDetails;
import com.titan.poss.config.dto.request.json.OrderRangeConfigDetails;
import com.titan.poss.config.dto.request.json.WeightTolRuleDetails;
import com.titan.poss.config.dto.request.json.WorkflowReqExpireGlobalConfig;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.dto.CNPriorityDetails;
import com.titan.poss.core.dto.CashPaymentRuleDetails;
import com.titan.poss.core.dto.GRNOwnerTypeConfigDto;
import com.titan.poss.core.dto.GrnApprovalAccessConfigDtoJson;
import com.titan.poss.core.dto.RivaahEligibilityProductMappingDetails;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class RuleDetailsFactory {

	Map<String, BaseFieldsValidator> ruleDetails = new HashMap<>();

	RuleDetailsFactory() {
		ruleDetails.put(RuleTypeEnum.CONVERSIONS.toString() + ConfigConstants.PRODUCT_LEVEL,
				new ConversionRuleDetails());
		ruleDetails.put(RuleTypeEnum.WEIGHT_TOLERANCE.toString() + ConfigConstants.PRODUCT_LEVEL,
				new WeightTolRuleDetails());
		ruleDetails.put(RuleTypeEnum.IBT_CONFIGURATIONS.toString() + ConfigConstants.HEADER_LEVEL,
				new IbtRuleDetails());
		ruleDetails.put(RuleTypeEnum.CASH_CONFIGURATION.toString() + ConfigConstants.HEADER_LEVEL,
				new CashPaymentRuleDetails());
		ruleDetails.put(RuleTypeEnum.HISTORY_TIME_CONFIGURATION.toString() + ConfigConstants.HEADER_LEVEL,
				new HistoryTimeRuleDetails());
		ruleDetails.put(RuleTypeEnum.GRF_CONFIGURATION.toString() + ConfigConstants.HEADER_LEVEL,
				new GrfConfigDetails());
		ruleDetails.put(RuleTypeEnum.GRN_TOLERANCE_CONFIG.toString() + ConfigConstants.HEADER_LEVEL,
				new GrnToleranceConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_AB_NON_FROZEN_TOLERANCE.toString() + ConfigConstants.RANGE_LEVEL,
				new OrderRangeConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_AB_FROZEN_TOLERANCE.toString() + ConfigConstants.RANGE_LEVEL,
				new OrderRangeConfigDetails());
		ruleDetails.put(RuleTypeEnum.BGR_TOLERANCE_CONFIG.toString() + ConfigConstants.RANGE_LEVEL,
				new BGRToleranceRangeDetails());
		ruleDetails.put(RuleTypeEnum.CN_PRIORITY_CONFIG.toString() + ConfigConstants.HEADER_LEVEL,
				new CNPriorityDetails());
		ruleDetails.put(RuleTypeEnum.ADV.toString() + ConfigConstants.HEADER_LEVEL, new AdvanceCNRuleDetails());
		ruleDetails.put(RuleTypeEnum.BILL_CANCELLATION.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.GEP.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.GHS.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.GRN.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.CN_IBT.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.TEP.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_AB_PAYMENT_CONFIG.toString() + ConfigConstants.PRODUCT_LEVEL,
				new OrderPaymentConfigDetails());
		ruleDetails.put(RuleTypeEnum.GRN_INTER_OWNER_TYPE.toString() + ConfigConstants.HEADER_LEVEL,
				new GRNOwnerTypeConfigDto());
		ruleDetails.put(RuleTypeEnum.GRN_APPROVAL_ACCESS_REGULAR.toString() + ConfigConstants.HEADER_LEVEL,
				new GrnApprovalAccessConfigDtoJson());
		ruleDetails.put(RuleTypeEnum.GRN_APPROVAL_ACCESS_MFG_DEFECT.toString() + ConfigConstants.HEADER_LEVEL,
				new GrnApprovalAccessConfigDtoJson());
		ruleDetails.put(RuleTypeEnum.ORDER_AB_BGR_CONFIG.toString() + ConfigConstants.HEADER_LEVEL,
				new BGRConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_AB_RESIDUAL_TOLERANCE_CONFIG.toString() + ConfigConstants.RANGE_LEVEL,
				new OrderRangeConfigDetails());
		ruleDetails.put(RuleTypeEnum.WORKFLOW_REQEXPIRE_GLOBAL_CONFIG.toString() + ConfigConstants.HEADER_LEVEL,
				new WorkflowReqExpireGlobalConfig());
		ruleDetails.put(RuleTypeEnum.FTEP_APPROVAL_ACCESS_REGULAR.toString() + ConfigConstants.HEADER_LEVEL,
				new GrnApprovalAccessConfigDtoJson());
		ruleDetails.put(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.toString() + ConfigConstants.PRODUCT_LEVEL,
				new RivaahEligibilityProductMappingDetails());
		ruleDetails.put(RuleTypeEnum.DIGI_GOLD_NON_TANISHQ.toString() + ConfigConstants.HEADER_LEVEL,
				new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.DIGI_GOLD_TANISHQ.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.TCS_CREDIT_NOTE.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.EVOUCHER.toString() + ConfigConstants.HEADER_LEVEL, new CNRuleDetails());
		ruleDetails.put(RuleTypeEnum.AMENDMENT_CONFIGURATION.toString() + ConfigConstants.HEADER_LEVEL,
				new AmendmentRuleDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_CO_NON_FROZEN_TOLERANCE.toString() + ConfigConstants.RANGE_LEVEL,
						new OrderRangeConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_CO_FROZEN_TOLERANCE.toString() + ConfigConstants.RANGE_LEVEL,
						new OrderRangeConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_CO_RESIDUAL_TOLERANCE_CONFIG.toString() + ConfigConstants.RANGE_LEVEL,
				new OrderRangeConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_CO_PAYMENT_CONFIG.toString() + ConfigConstants.PRODUCT_LEVEL,
				new OrderPaymentConfigDetails());
		ruleDetails.put(RuleTypeEnum.ORDER_CO_BGR_CONFIG.toString() + ConfigConstants.HEADER_LEVEL,
				new BGRConfigDetails());
		ruleDetails.put(RuleTypeEnum.BGR_CO_TOLERANCE_CONFIG.toString() + ConfigConstants.RANGE_LEVEL,
				new BGRToleranceRangeDetails());

		// ruleDetails.put(key, value)

	}

	public BaseFieldsValidator getRuleDetails(String ruleType) {

		return ruleDetails.get(ruleType);

	}
}
