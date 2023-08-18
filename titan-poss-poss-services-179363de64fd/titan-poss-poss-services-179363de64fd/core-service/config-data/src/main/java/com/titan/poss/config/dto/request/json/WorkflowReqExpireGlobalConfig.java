/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowReqExpireGlobalConfig extends BaseFieldsValidator{
	
	@PatternCheck(regexp = RegExConstants.WORKFLOW_REQEXPIRE_GLOBAL_CONFIG_REGEX, message = "Maximum 4 Digits are Allowed for this Configuration. Please Provide the value within that limit.")
	String timeToExpirePendingRequests;

}
