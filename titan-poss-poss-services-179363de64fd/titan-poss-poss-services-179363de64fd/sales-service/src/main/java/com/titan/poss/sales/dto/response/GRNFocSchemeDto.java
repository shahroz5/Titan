/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import com.titan.poss.sales.dto.EligibleFocItemListDto;
import com.titan.poss.sales.dto.PurchaseItemListDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GRNFocSchemeDto {

	private String schemeId;
	private String schemeName;

	private EligibleFocItemListDto eligibleFocItemDetails;
	private PurchaseItemListDto purchaseItemDetails;

}
