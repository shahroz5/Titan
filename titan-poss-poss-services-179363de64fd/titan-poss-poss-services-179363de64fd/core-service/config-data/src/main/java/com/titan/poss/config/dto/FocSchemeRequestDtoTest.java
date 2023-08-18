/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.discount.dto.FocSchemeRequestDto;
import com.titan.poss.core.dto.FocSchemeIndividualDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class FocSchemeRequestDtoTest extends FocSchemeRequestDto {

	@NotNull
	@Size(min = 1)
	List<FocSchemeIndividualDto> focSchemes;
}
