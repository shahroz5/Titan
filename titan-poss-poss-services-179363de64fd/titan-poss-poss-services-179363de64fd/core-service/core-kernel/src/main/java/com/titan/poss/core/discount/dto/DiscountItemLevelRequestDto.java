/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * Request DTO class to fetch FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemLevelRequestDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;
	private EncircleDiscountDto encircleDiscount;
	private EmployeeDiscountDetailsDto employeeDetails;
	private TataEmployeeDiscountDetailsDto tataEmployeeDetails;
	private TSSSDiscountDetailsDto tsssDetails;
	private DiscountItemDetailsDto itemDetails;
	private TransactionDetailsDto transactionDetails;
	private EmpowermentDetailsDto empowermentDetails;
	private RivaahGhsDiscountDetailsDto rivaahGhsDetails;

	private List<DiscountItemDetailsDto> itemDetailsForCummulativeCal;// for slab/high value discount

}
