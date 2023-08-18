/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountProductDto {

	private String id;

	private String discountId;

	private String discountDetailsId;

	private String productGroupCode;

	private BigDecimal eligibleKarat;

	private String karatType;

	private String productType;

	private String description;

	private Boolean isDeletable;

	private Boolean isActive;
}
