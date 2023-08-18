/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.dto.DiscountDetailsConfigRequestDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AbCoSlabDiscountRequestDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;
	private List<DiscountItemDetailsReqDto> itemDetails;
	private DiscountCustDetails customerDetails;
	private TransactionDetailsDto transactionDetails;
	private DiscountDetailsConfigRequestDto discountDetilsConfigRequestDto;

}
