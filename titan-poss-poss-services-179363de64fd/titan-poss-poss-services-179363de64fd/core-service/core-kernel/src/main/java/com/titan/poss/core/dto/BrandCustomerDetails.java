/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

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
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BrandCustomerDetails extends BaseFieldsValidator {
	
	@NotNull
	private List<Integer> regularMobileNoStartsWith;
	@NotNull
	private List<Integer> internationalMobileNoStartsWith;
	@NotNull
	private List<Integer> institutionalMobileNoStartsWith;
	@NotNull
	private List<Integer> oneTimeMobileNoStartsWith;

}
