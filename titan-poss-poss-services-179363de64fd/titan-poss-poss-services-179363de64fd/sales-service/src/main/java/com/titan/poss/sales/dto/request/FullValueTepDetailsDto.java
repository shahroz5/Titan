/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FullValueTepDetailsDto {

	private List<String> tepValue;// Current Value or Overriding Value or invoice Value
	private BigDecimal overrideValue;
	private String approverRemarks;
	private List<String> paymentValue;// Full Value or Propotioned Value
}
