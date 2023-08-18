/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * DTO class to map the response of inserted stock request item details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RequestDtlsInsertResponseDto {

	private Short totalRequestedQuantity;
	private Integer totalRequestCreatedItems;
	private BigDecimal totalRequestedWeight;
	private BigDecimal totalRequestedValue;

}
