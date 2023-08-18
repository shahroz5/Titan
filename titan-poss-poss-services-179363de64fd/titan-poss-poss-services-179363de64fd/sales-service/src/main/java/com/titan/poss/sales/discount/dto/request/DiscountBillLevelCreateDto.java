/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.discount.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.EmployeeDiscountDetailsDto;
import com.titan.poss.core.discount.dto.EmpowermentDetailsDto;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDto;
import com.titan.poss.core.discount.dto.RivaahCardDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDetailsDto;
import com.titan.poss.core.discount.dto.TSSSDiscountDetailsDto;
import com.titan.poss.core.discount.dto.TataEmployeeDiscountDetailsDto;

import lombok.Data;

/**
 * Request DTO for Bill level discounts applied
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountBillLevelCreateDto {

	@NotEmpty(message = "Eligible Discount list shouldn't be empty")
	List<@Valid DiscountBillLevelItemDetailsDto> discountDetails;

	@Valid
	private EmployeeDiscountDetailsDto employeeDetails;

	@Valid
	private TataEmployeeDiscountDetailsDto tataEmployeeDetails;

	@Valid
	private TSSSDiscountDetailsDto tsssDetails;

	@Valid
	private RivaahCardDiscountDetailsDto rivaahCardDetails;

	@Valid
	private GhsDiscountVoucherDto ghsDiscountDetails;

	@Valid
	private EmpowermentDetailsDto empowermentDetails;

	@Valid
	private RivaahGhsDiscountDetailsDto rivaahGhsDetails;
}
