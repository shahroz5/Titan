/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AbCoValidateDiscountRequestDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@NotNull
	private Date businessDate;
	
	private List<DiscountDetailsBaseResponseDto> discounts;
	
	private List<ClubbingDiscountDetailsDto> clubDiscounts;
	
	private DiscountItemDetailsReqDto itemDetails;
	
	private DiscountCustDetails customerDetails;
	
	private TransactionDetailsDto transactionDetails;
	
}
