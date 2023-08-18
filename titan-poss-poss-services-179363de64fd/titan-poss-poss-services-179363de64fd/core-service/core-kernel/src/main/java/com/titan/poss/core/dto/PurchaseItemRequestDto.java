/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class PurchaseItemRequestDto {

	private String productGroupCode;
	private List<FocItemDetailsDto> focItemDetails;
	private BigDecimal totalMetalWeight;
	private BigDecimal totalStoneWeight;
	private BigDecimal totalMaterialWeight;
	private BigDecimal totalValue;
	private BigDecimal totalDiscount;
	private BigDecimal totalTax;

}
