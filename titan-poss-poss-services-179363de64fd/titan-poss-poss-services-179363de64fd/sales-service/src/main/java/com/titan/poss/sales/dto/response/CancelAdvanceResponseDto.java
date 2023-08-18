/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Map;

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
public class CancelAdvanceResponseDto {

	private String id;
	private Integer docNo;
	private Map<String, Integer> cNdocNos;
	private Map<String, String> cNDocTypes;
	private BigDecimal tcsCnAmt;

}
