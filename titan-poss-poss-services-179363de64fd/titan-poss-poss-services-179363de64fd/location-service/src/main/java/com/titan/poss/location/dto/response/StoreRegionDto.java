/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StoreRegionDto {

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid regionCode")
	private String regionCode;

	private Boolean isActive;

}

