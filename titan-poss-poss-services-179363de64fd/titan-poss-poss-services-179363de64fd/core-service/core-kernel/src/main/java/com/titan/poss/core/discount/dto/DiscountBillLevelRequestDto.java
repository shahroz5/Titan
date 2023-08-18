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
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountBillLevelRequestDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;
	private String discountType;
	private EmployeeDiscountDetailsDto employeeDetails;

	private TataEmployeeDiscountDetailsDto tataEmployeeDetails;

	private TSSSDiscountDetailsDto tsssDetails;

	private List<DiscountItemsDto> itemDetails;

	private EmpowermentDetailsDto empowermentDetails;

	private RivaahGhsDiscountDetailsDto rivaahGhsDetails;

}
