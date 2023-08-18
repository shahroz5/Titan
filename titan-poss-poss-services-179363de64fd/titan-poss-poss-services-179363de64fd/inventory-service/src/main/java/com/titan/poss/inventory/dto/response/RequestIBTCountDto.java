/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * DTO class to get the IBT count of a requesting Boutique
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RequestIBTCountDto {

	private Long ibtCount;

	private Long totalRequestedQuantity;

	private BigDecimal totalRequestedValue;

	public RequestIBTCountDto(Long ibtCount, Long totalRequestedQuantity, BigDecimal totalRequestedValue) {
		super();
		this.ibtCount = ibtCount;
		this.totalRequestedQuantity = totalRequestedQuantity;
		this.totalRequestedValue = totalRequestedValue;
	}

}
