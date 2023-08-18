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
public class ItemThemeMappingDto {

	private String id;

	private String discountId;

	private Boolean isExcluded;

	private String itemCode;

	private String themeCode;
	
	private String schemeCode;

	private BigDecimal fromValue;

	private BigDecimal toValue;
	
	private String excludeType;

	private Boolean isDeletable;

	private Boolean isActive;
}
