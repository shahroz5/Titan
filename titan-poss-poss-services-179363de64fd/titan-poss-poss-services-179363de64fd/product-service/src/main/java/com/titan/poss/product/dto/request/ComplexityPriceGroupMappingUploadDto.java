/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Range;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ComplexityPriceGroupMappingUploadDto {

	@NotNull(message = "Please provide the id")
	private String id;

	@NotNull(message = "Please provide the complexityCode")
	@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX)
	private String complexityCode;

	@NotNull(message = "Please provide the priceGroup")
	private String priceGroup;

	@NotNull(message = "Please provide the makingChargePunit")
	private BigDecimal makingChargePunit;

	@Range(min = 0, max = 100)
	private BigDecimal makingChargePgram;

	@Range(min = 0, max = 100)
	private BigDecimal wastagePct;

	@Range(min = 0, max = 100)
	private BigDecimal makingChargePct;
	
	private Boolean isActive;
		
}
