/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author  Mindtree Ltd. 
 * @version 1.0
 */
@Data
public class BinDto {

	@NotNull(message = "Please provide the binCode")
	@Size(min = 3, max = 20, message = "binCode min length is 3 and max length is 20")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid binCode")
	private String binCode;

	@NotNull(message = "Please provide the binGroups")
	@NotEmpty(message = "binGroups cannot be empty")
	private List<@Valid BinGroupCodeDto> binGroups;

	@Size(max = 100, message = "description max length is 100")
	private String description;


}
