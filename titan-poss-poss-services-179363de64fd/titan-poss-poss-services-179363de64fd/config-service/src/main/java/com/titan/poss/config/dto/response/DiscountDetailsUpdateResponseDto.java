/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountDetailsUpdateResponseDto {

	private String id;

	private String slabName;

	private String discountId;

	private BigDecimal minValue;

	private BigDecimal maxValue;

	private String eligibility;
	
	private String discountCategory;

	private Boolean isSingle;

	private Integer rowId;

	private Boolean isActive;

	private List<JsonData> discountComponents;

	private List<JsonData> configDetails;

	private String discountPercent;

}
