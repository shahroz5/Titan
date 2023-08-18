/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CNRuleDetails extends BaseFieldsValidator {

	private Boolean isCancellationAllowed; // used whille raising request
	private String deductionRate; // should use when cancelling cn
	private String criteriaRateForDeduction; // should use when cancelling cn
	private String residentialValueAmount; // should be used in create cn
	private Boolean isBrandWiseTransferAllowed; // should use when raising request for ibt transfer
	private Boolean isBoutiqueWiseTransferAllowed; // should use when rising request for ibt transfer
	private String gHSUtilizationTransferPercent; // should be used when ghs transfer
	private String gHSMaxAmountTransfer; // should be used when ghs transfer

}
