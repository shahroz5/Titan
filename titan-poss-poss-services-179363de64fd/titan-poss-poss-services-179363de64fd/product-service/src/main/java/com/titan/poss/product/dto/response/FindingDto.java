/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FindingDto {

	@NotNull
	@Size(max = 20, message = "Finding.finding_code max len: 20 min len: -1")
	private String findingCode;

	@NotNull
	@Size(max = 100, message = "Finding.description max len: 100 min len: -1")
	private String description;
}
