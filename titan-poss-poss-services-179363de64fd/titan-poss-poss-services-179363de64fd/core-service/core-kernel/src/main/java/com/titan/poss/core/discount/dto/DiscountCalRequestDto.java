/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.dto.CumulativeItemDetails;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountCalRequestDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;
	private DiscountItemDetailsReqDto itemDetails;
	private DiscountCustDetails customerDetails;
	private CumulativeItemDetails cumulativeItemDetails;
	private TransactionDetailsDto transactionDetails;
	private RivaahGhsDiscountDto eligibleRivaahGhsDetails;
	private Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails;// discount id is key
																									// and respective
																									// cumm. details is
																									// the value

}
