/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class MetalBasePriceRequestDto {

	private List<String> marketCodes;

	@ValueOfEnum(enumClass = PriceTypeCodeEnum.class)
	private String priceTypeCode;

	// @FutureOrPresent
	private Date applicableDate;

	@NotNull(message = "Please provide basePrice")
	@Min(0)
	private Integer basePrice;
}
