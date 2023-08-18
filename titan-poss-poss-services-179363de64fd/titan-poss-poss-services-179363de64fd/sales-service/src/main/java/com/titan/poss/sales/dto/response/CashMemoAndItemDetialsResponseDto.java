/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for cash memo and item details response.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CashMemoAndItemDetialsResponseDto extends CashMemoResponseDto {

	ItemDetailsResponseDto itemDetailsDto;
}
