/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PurityCreateDto {

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX, nullCheck = true)
	private String itemTypeCode;

	@NotNull(message = "Please provide purity")
	@DecimalMin(value = "0", inclusive = true, message = "min value of purity is 0")
	@DecimalMax(value = "100", inclusive = true, message = "max value of purity is 100")
	@Digits(integer = 6, fraction = 7, message = "purity valid till 7 decimal places only")
	private BigDecimal purity;

	@DecimalMin(value = "0", inclusive = true, message = "min value of karat is 0")
	@DecimalMax(value = "24", inclusive = true, message = "max value of karat is 24")
	@Digits(integer = 6, fraction = 3, message = "karat valid till 3 decimal places only")
	private BigDecimal karat;

	@NotNull(message = "Please provide the offset")
	@DecimalMin(value = "0", inclusive = true, message = "min value of offset is 0")
	@DecimalMax(value = "3", inclusive = true, message = "max value of offset is 3")
	@Digits(integer = 2, fraction = 5, message = "offset valid till 5 decimal places only")
	private BigDecimal offset;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String description;

	private Boolean isActive;

	@NotNull
	private Boolean isDisplayed;

}
