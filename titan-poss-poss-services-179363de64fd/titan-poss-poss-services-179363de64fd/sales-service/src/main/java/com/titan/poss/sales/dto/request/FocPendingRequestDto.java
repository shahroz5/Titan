/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.sales.dto.FocSchemeDto;

import lombok.Data;

/**
 * Request DTO class to Create Pending FOC for Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocPendingRequestDto {

	@NotEmpty
	private List<@Valid FocSchemeDto> focSchemes;

}
