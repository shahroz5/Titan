/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import java.util.List;


import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BinCreateDto {

	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = true)
	private String binCode;

	private List<@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX, nullCheck = true) String> binGroups;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String description;

}
