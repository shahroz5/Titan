/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dto.request;

import lombok.Data;

/**
 * DTO class to update Catchment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CatchmentUpdateDto {

//	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, nullCheck = false)
	private String description;

	private Boolean isActive;
}