/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class CmDetailsResponseDto {

	private String itemCode;

	private String lotNumber;

	private BigDecimal totalWeight;

	private String cashMemoDetailsId;

	private BigDecimal totalValue;

	private Short totalQuantity;

	private Short totalPendingQuantity;

	private String productGroupCode;

	private Boolean isCmAllowed;
	
	private Boolean isTepAllowed;
	
	private BigDecimal discountRecovered;
}
