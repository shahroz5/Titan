/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.FocItemDetailsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO class for FOC item added to CM
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class FocItemResponseDto extends FocItemDetailsDto {

	private String id;

	private Short rowId;

	private String focSchemeId;

	private String salesTxnId;

	private String binCode;

	private String status;

	private BigDecimal totalValue;

	private JsonData schemeDetails;
	
	private Boolean isManualFOC;  
	
	private JsonData manualFocSchemeDetails;
}
