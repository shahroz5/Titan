/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

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
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ClubbingConfigDetails extends BaseFieldsValidator {

	private Boolean isExchangeOffer;

	private Boolean isGHS;

	private Boolean isRiva;

	private Boolean isEmpowerment;

	private Boolean isDV;

	private Boolean isFOCOffer;

	private Boolean isCBOOffer;

	private Boolean isBillLevelDiscount;

	private Boolean isOtherBillLevelDiscount;
	
	private Boolean isCoin;
	
	

}