/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

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
public class SlabConfigDetails extends BaseFieldsValidator {

	private String discountCategory;

	private String eligibilityDetails;

	private Boolean isSingle;

}
