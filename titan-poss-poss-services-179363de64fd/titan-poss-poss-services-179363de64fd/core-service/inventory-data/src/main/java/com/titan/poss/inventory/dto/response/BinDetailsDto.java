/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BinDetailsDto {
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid binCode")
	private String binCode;
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid binGroupCode")
	private String binGroupCode;


}

