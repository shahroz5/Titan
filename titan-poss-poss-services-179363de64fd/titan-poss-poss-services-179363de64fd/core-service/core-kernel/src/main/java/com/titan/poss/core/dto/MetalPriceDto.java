/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class MetalPriceDto {

	private String weightUnit;
	private BigDecimal netWeight;
	private BigDecimal metalValue;
	private String type;
	private BigDecimal ratePerUnit;
	private BigDecimal karat;
	private BigDecimal purity;
	private String metalTypeCode;
	private BigDecimal offset;
}
