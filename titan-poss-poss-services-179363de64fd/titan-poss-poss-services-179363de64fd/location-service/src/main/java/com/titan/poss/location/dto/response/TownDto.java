/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TownDto {

	private String townId;

	@NotNull(message = "Please provide stateCode")
	private String stateId;

	@NotNull(message = "Please provide description")
	@Size(max = 100, message = "Town description max len: 100 min len: -1")
	private String description;

	private Boolean isActive;

	private String stateName;
	
    private Integer eghsRefTownId;
}
