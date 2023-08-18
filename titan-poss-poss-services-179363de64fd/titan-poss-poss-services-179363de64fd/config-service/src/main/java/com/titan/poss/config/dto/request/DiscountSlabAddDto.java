/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;

import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.FocEligibilityEnum;
import com.titan.poss.config.dto.request.json.DiscountCategoryEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountSlabAddDto {

	private String slabName;

	//@NotNull
	@Digits(fraction = 3, integer = 18)
	private BigDecimal minValue;

	//@NotNull
	@Digits(fraction = 3, integer = 18)
	private BigDecimal maxValue;

	@ValueOfEnum(message = "Invalid Category", enumClass = DiscountCategoryEnum.class)
	private String discountCategory;

	
	@ValueOfEnum(message = ConfigConstants.INVALID_ELIGIBILITY, enumClass = FocEligibilityEnum.class)
	private String eligibility;

	private Boolean isSingle;

	private Integer rowId;

	private String discountPercent;

	private JsonData configDetails;
	
	private Boolean isActive;


}
