/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StoneCodeDto {

	@NotNull(message = "Please provide the itemCode")
	private String itemCode;

	@NotNull(message = "Please provide the noOfStones")
	@Pattern(regexp = "^[0-9]+$", message = "Invalid noOfStones")
	private Short noOfStones;

	@NotNull(message = "Please provide the stoneCode")
	private String stoneCode;
}
