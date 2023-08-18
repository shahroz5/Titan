/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.dto.PurchaseItemRequestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocSchemeForABResponseDto {

	private String schemeId;

	private String schemeName;

	private BigDecimal weight;

	private String schemeCategory;

	private List<String> schemeDetailId;

	private List<PurchaseItemRequestDto> purchaseItems;
}
