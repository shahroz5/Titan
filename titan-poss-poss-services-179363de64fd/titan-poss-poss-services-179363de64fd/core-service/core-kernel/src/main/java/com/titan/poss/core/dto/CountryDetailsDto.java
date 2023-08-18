/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CountryDetailsDto {

	@NotNull
	private String currencyCode;

	@NotNull
	private Integer fiscalYear;
	
	private String fiscalYearStart;

	@NotNull
	private String weightUnit;

	private String stoneWeightUnit;
}
