/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TepPriceRequest extends PriceRequest {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;

//	@NotNull(message = "measuredQuantity cannot be null")
//	@Positive(message = "measuredQuantity should be greater than 0")
	private Short measuredQuantity;

//	@PatternCheck(regexp="^(\\s*|[6-9][0-9]{9})$")
	private String customerMobileNo;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String cashMemoDetailsId;

	private List<BaseStoneDetails> stones;

	@NotNull(message = "Please provide tepType")
	@ValueOfEnum(enumClass = TepTypeEnum.class)
	private String tepType;
	
	private Boolean isDummyCode;
	
	private String customerType;

}
