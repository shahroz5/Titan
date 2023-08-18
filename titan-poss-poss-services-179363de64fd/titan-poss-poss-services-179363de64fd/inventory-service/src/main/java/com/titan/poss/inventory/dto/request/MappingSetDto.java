/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;


import java.util.Set;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MappingSetDto {


	@NotNull(message = "Kindly provide the set of remove mappings.")
	private Set<String> removeSet;

	@NotNull(message = "Kindly provide the set of add mappings.")
	private Set<String> addSet;

}
