/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;


import java.util.List;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * Request class for the deleting items from transfer.
 * 
 */
@Data
public class RemoveOtherItemsDto {
	
	@Size(max = 50)
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> itemIds; 
}
