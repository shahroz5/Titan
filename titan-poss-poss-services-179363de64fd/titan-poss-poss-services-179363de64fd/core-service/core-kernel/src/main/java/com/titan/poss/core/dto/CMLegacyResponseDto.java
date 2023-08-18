/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CMLegacyResponseDto {

	@JsonProperty("cm")
	private CashMemoDto cashMemo;

	@JsonProperty("cmDetails")
	private List<CashMemoDetailsDto> cmVariant;

	@JsonProperty("customerMaster")
	private CustomerDetailsDto customerDetails;

	@JsonProperty("TEPVariant")
	private List<TepVariantDto> tepVariantDetails;
	
}
