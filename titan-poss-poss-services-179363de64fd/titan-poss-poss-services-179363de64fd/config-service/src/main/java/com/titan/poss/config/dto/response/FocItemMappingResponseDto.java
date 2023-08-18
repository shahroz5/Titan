/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FocItemMappingResponseDto {

	private String id;

	private String schemeId;

	private String itemCode;
	
	private BigDecimal karat;
	
	private BigDecimal stdWeight;
	
	
}
