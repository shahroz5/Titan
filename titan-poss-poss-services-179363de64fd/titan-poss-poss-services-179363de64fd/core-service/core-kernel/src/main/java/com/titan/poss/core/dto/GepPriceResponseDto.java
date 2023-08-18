/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GepPriceResponseDto {

	private BigDecimal purity;
	private BigDecimal karat;
	private String weightUnit;
	private BigDecimal measuredWeight;
	private BigDecimal ratePerUnit; // standard rate per unit for 1gm
	private BigDecimal rateForPurity; // rate per purity of item for 1gm

	private BigDecimal schemePercentage;
	private BigDecimal deductionPercentage;
	private BigDecimal netValue;
	private BigDecimal deductionValue;
	private BigDecimal schemeValue;
	private BigDecimal finalValue;

	private String configId;
	private String configCode;
	private String configType;

	private Date startDate; // scheme start date
	private Date endDate; // scheme end date

}
