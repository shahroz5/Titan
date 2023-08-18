/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;



import static com.titan.poss.core.domain.constant.RegExConstants.PRICE_GROUP_REGEX;

import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PriceGroupMapDto {
	
	private String id;

	@Pattern(regexp = PRICE_GROUP_REGEX)
	private String priceGroup;
	
	private String pricingGroupType;
	
	
}
