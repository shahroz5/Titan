/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dto to get coin details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinDetailsDto {

	private String itemCode;
	private String itemDescription;
	private Integer totalQuantity;
	private BigDecimal karatage;
	private BigDecimal stdWeight;
	private BigDecimal unitWeight;
	private String unit;
	private Object totalWeightDetails;
	private String productGroupCode;
	private String productCategoryCode;
	private BigDecimal stdValue;
}
