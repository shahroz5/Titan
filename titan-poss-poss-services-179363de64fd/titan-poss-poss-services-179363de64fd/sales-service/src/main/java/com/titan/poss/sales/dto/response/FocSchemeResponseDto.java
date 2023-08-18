/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.EligibleFocItemListDto;
import com.titan.poss.sales.dto.PurchaseItemListDto;

import lombok.Data;

/**
 * Response DTO class for FocSchemes
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocSchemeResponseDto {

	private String id;

	private String salesTxnId;

	private BigDecimal eligibleWeight;

	private Integer eligibleQuantity;

	private JsonData schemeDetails;

	private PurchaseItemListDto purchaseItemDetails;

	private EligibleFocItemListDto eligibleFocItemDetails;

	private String status;

}
