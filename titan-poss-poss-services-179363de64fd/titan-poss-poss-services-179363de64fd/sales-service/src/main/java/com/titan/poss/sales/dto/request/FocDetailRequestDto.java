/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.sales.dto.FocDetailDto;

import lombok.Data;

/**
 * Request DTO class for Adding FOC items to CM
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocDetailRequestDto {

	@NotEmpty
	private List<@Valid FocDetailDto> focDetails;

}
