/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class GrnApprovalAccessConfigDtoJson extends BaseFieldsValidator {

	@NotNull
	@Size(min = 1)
	private List<@Valid GrnApprovalAccessConfigDto> config;

	@Override
	public String toString() {
		return "GrnApprovalAccessConfigDto [config=" + config + "]";
	}

}
