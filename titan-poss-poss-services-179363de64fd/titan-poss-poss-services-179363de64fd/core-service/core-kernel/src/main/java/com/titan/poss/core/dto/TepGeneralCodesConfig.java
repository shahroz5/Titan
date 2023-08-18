/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

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
public class TepGeneralCodesConfig extends BaseFieldsValidator {

	@NotNull(message = "isCMMandatory cannot be null")
	private Boolean isCMMandatory;

	@NotNull(message = "isValuationAtStore cannot be null")
	private Boolean isValuationAtStore;
}
