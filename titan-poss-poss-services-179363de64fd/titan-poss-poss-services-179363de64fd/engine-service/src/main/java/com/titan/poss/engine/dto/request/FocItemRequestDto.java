/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * Request DTO class to fetch FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocItemRequestDto {

	List<@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX,nullCheck = true) String> itemsCodes;

}
