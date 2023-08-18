/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MultiMetalDetailsDto {
	
	private String lotNumber;
	
	private String itemCode;
	
	private Integer lineItemNo;
	
	private String multiMetalCode;
	
	@JsonProperty("MultiMetalWeight")
	private BigDecimal materialWeight;
	
	@JsonProperty("quantity")
	private Integer noOfMaterials;
}
