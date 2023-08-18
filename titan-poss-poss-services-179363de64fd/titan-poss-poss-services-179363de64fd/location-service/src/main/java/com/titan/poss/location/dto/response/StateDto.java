/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class StateDto {

	@NotNull(message = "Please provide the stateCode")
	private String stateId;

	@NotNull(message = "Please provide the description")
	private String description;

	@NotNull(message = "Please provide the countryCode")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Invalid stateCode")
	private String countryCode;

	@NotNull(message = "Please provide the stateCode")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Invalid stateCode")
	private String stateCode;

	private Object configDetails;

	private Boolean isActive;

	private Boolean isUnionTerritory;
	
    private Integer eghsRefStateId;

}
