/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import javax.validation.Valid;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FocDetailAbDto {

	@Valid
	private List<FocDetailAbRequestDto> focScheme;
}
