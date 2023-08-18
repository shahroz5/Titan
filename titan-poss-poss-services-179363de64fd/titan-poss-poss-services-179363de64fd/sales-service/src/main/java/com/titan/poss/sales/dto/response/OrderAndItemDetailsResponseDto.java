/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO class for Order and it's Item details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderAndItemDetailsResponseDto extends OrderResponseDto {

	OrderItemDetailsResponseDto itemDetailsDto;

}
