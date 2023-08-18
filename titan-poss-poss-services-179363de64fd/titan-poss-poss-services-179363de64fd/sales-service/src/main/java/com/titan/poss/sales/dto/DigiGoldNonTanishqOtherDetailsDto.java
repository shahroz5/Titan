/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.titan.poss.sales.dto.validators.BasePaymentFieldsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DigiGoldNonTanishqOtherDetailsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide mobileNo")
	private String mobileNo;

	@NotNull(message = "Please provide non Tanishq gold grams to be redeemed")
	private BigDecimal nonTanishqGoldGrams;

	@NotNull(message = "Please provide totalGrams to be redeemed")
	private BigDecimal totalGrams;

	@NotNull(message = "Please provide the selling price from digi gold")
	private BigDecimal sellingPrice;

	private String transactionId;

	private Integer creditNoteNo;

}
