/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for GHS exclude product group codes.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GhsExcludeProductGroupDetailsDto {

	private List<String> ghsExcludeProductGroups;
	// all details are useful on GRN
	private BigDecimal makingChargeDiscountPercent;
	private BigDecimal ucpDiscountPercent;
	private String accountNo;
	private BigDecimal bonus;
	private String schemeType;
	private String schemeCode;
	private String paymentCode;

}
