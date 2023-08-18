/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
//@AllArgsConstructor
public class ReturnableItemsDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	@JsonProperty("itemId")
	private String cashMemoDetailsId;
	
	@NotNull(message = "Please provide Total Quantity")
	@Positive(message = "Total Quantity must be positive")
	private long totalQuantity;
	public ReturnableItemsDto(String cashMemoDetailsId,long totalQuantity) {
		super();
		this.cashMemoDetailsId = cashMemoDetailsId;
		this.totalQuantity = totalQuantity;
	}
	
	
}
