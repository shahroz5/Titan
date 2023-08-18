/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper=false)
public class DiscountItemListResponseDto extends DiscountDetailsResponseDto {

	private String itemId;
	private String itemCode;
	private String lotNumber;
	private String clubDiscountId;
}
