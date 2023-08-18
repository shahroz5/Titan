/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.titan.poss.sales.dto.DiscountDetailDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemLevelCreateDto {

	@NotEmpty
	private List<DiscountDetailDto> discountDetails;

}
