/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.constants.SalesConstants;

import lombok.Data;

/**
 * DTO class holds FOC item details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocItemDetailsDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = true)
	private String lotNumber;

	private List<String> productGroupList;

	@NotNull(message = "Please provide Unit Weight")
	@Positive(message = "Unit Weight must be positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Unit Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal unitWeight;

	@NotNull(message = "Please provide Total Weight")
	@Positive(message = "Total Weight must be positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Total Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalWeight;

	@NotNull(message = "Please provide Total Quantity")
	@Positive(message = "Total Quantity must be positive")
	private Short totalQuantity;

	@PatternCheck(regexp = SalesConstants.UUID_REGEX, message = "Invalid inventoryId")
	private String inventoryId;

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true)
	private String employeeCode;
	
	private Short actualQuantity;

}
