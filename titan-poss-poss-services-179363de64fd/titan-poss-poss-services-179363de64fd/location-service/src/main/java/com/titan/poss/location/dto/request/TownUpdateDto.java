/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100;

import javax.validation.constraints.Pattern;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TownUpdateDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String stateId;

	@Pattern(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String description;

	private Boolean isActive;

}
