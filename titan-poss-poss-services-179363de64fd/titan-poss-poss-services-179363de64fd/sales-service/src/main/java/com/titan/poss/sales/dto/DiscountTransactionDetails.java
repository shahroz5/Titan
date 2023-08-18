/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.validation.Valid;

import com.titan.poss.core.discount.dto.DigiGoldTanishqDiscountDto;
import com.titan.poss.core.discount.dto.EmployeeDiscountDetailsDto;
import com.titan.poss.core.discount.dto.EmpowermentDetailsDto;
import com.titan.poss.core.discount.dto.EncircleDiscountDto;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDetailsDto;
import com.titan.poss.core.discount.dto.RivaahCardDiscountDetailsDto;
import com.titan.poss.core.discount.dto.TSSSDiscountDetailsDto;
import com.titan.poss.core.discount.dto.TataEmployeeDiscountDetailsDto;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.sales.dto.response.RivaahGhsDiscountDetailsExtDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * DTO class to capture discount details at transaction level
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class DiscountTransactionDetails extends BaseFieldsValidator {

	@Valid
	private EmployeeDiscountDetailsDto employeeDetails;

	@Valid
	private TataEmployeeDiscountDetailsDto tataEmployeeDetails;

	@Valid
	private TSSSDiscountDetailsDto tsssDetails;

	@Valid
	private RivaahCardDiscountDetailsDto rivaahCardDetails;

	@Valid
	private EncircleDiscountDto encircleDetails;

	@Valid
	private GhsDiscountVoucherDetailsDto ghsDiscountDetails;

	@Valid
	private EmpowermentDetailsDto empowermentDetails;

	@Valid
	private DigiGoldTanishqDiscountDto digiGoldDetails;

	@Valid
	private RivaahGhsDiscountDetailsExtDto rivaahGhsDiscountDetails;

}
