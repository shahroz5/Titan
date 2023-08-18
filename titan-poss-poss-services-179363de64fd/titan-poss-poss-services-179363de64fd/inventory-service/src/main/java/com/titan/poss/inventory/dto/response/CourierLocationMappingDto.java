/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CourierLocationMappingDto {

	@NotNull
	private Integer id;

	@NotNull
	private CourierDto courier;

	@NotNull
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid locationCode")
	private String locationCode;
}
