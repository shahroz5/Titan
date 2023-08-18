/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.FocItemDetailsDto;

import lombok.Data;

/**
 * Request DTO class of FOC details during the Issue of Pending FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class IssueFocDetailsRequestDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	public String focSchemeId;

	@NotEmpty
	List<@Valid FocItemDetailsDto> focItemDetails;

}
