/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.List;

import com.titan.poss.core.dto.CumulativeItemDetails;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemDetailsListRequestDto {

	// @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;
	private List<String> discountIds;
	private List<DiscountBillLevelClubDetailsDto> clubDiscountDetails;
	private List<DiscountItemDetailsReqDto> itemDetails;
	private DiscountCustDetails customerDetails;
	private CumulativeItemDetails cumulativeItemDetails;
	private TransactionDetailsDto transactionDetails;

	private EmployeeDiscountDetailsDto employeeDetails;
	private TataEmployeeDiscountDetailsDto tataEmployeeDetails;
	private TSSSDiscountDetailsDto tsssDetails;
	private EmpowermentDetailsDto empowermentDetails;
	private RivaahGhsDiscountDetailsDto rivaahGhsDetails;
	private EncircleDiscountDto encircleDiscount;

}
