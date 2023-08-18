/*  
 * Copyright 2022. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class NomineeDetails extends BaseFieldsValidator {

	private String nomineeName;
	private String address;
	private String mobileNumber;
	private String relationship;

}
