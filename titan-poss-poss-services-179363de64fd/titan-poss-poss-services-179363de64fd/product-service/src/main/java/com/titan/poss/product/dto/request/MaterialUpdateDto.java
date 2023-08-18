/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MaterialUpdateDto {

	private String materialTypeCode;

	private BigDecimal stdValue;

	private BigDecimal stdWeight;

	private BigDecimal ratePerGram;

	private String color;

	private String quality;

	private String shape;

	private String weightUnit;

	private String currencyCode;

	private Boolean isActive;
}
