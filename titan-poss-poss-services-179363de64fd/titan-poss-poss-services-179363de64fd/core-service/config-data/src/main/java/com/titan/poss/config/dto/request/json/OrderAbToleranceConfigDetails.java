/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderAbToleranceConfigDetails extends BaseFieldsValidator {

	private Boolean isApplicableForNonFrozenOrder;

	private Boolean isApplicableForFrozenOrder;

}
