/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class for discount related details for Tata employee discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TataEmployeeDiscountDetailsDto {

	// @PatternCheck(regexp = "^(?!0)")
	private String employeeId;

	private String employeeName;

	private String companyName;

	private Boolean isIdProofUploaded;

	private int discountAvailedCount;

	// To identify latest applied check boxed discount
	private Date appliedDate;

}
