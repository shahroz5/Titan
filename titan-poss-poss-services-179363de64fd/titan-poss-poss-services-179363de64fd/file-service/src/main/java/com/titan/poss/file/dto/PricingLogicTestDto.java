/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PricingLogicTestDto {

	private String itemCode;

	private String lotNumber;

	private BigDecimal goldRate;

	private BigDecimal silverRate;

	private BigDecimal platinumRate;

	private BigDecimal measuredWeight;

	private BigDecimal metalPrice;

	private BigDecimal stoneValue;

	private BigDecimal makingCharge;

	private BigDecimal calculatedMetalPrice;

	private BigDecimal calculatedStoneValue;

	private BigDecimal calculatedMakingCharge;

	private Boolean result;

	private String fileId;

	private String remarks;

	private String locationCode;
	
	private String cfaProductCode;
	
	private String complexityCode;
	
	private BigDecimal makingChargePercentage;
}
