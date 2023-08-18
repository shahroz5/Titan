/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import javax.annotation.Nullable;
import javax.validation.Valid;

import lombok.Data;

/**
 * DTO class holds both FOC schemes & FOC items opted
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocDetailDto {

	@Valid
	private FocSchemeDto focScheme;

	@Nullable
	private List<@Valid FocItemDetailsDto> focItemDetails;

}
