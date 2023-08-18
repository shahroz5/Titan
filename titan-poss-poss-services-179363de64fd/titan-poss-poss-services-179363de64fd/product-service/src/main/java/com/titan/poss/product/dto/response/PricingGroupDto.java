/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

/** 
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PricingGroupDto {

	@NotNull(message = "Please provide the pricingGroupType")
	@Size(min = 1, max = 20, message = "pricingGroupType min length is 1 and max length is 20")
	private String pricingGroupType;

	@Size(max = 100, message = "description max length is 100")
	private String description;
}
