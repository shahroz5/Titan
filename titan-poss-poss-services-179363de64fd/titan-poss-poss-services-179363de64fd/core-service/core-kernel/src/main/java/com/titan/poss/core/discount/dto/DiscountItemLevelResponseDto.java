/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * Request DTO class to fetch FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemLevelResponseDto {

	private List<DiscountDetailsBaseResponseDto> discounts;

	private List<ClubbingDiscountDetailsDto> clubDiscounts;

	private Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails;// discount id is key
																									// and respective
																									// cmm. details is
																									// the value

}
