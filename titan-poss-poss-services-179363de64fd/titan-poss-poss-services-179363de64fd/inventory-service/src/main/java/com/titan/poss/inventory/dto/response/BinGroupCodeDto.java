/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BinGroupCodeDto {

	@NotNull(message = "Please provide the binGroupCode")
	@Size(min = 3, max = 20, message = "binGroupCode min length is 3 and max length is 20")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid binGroupCode")
	private String binGroupCode;

	@NotNull(message = "Please provide the isActive")
	private Boolean isActive;

}

