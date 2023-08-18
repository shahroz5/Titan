/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import javax.validation.constraints.NotNull;

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
public class StateTaxMappingDto {

	@NotNull
	private String id;

	private String stateId;

	private String stateName;

	@NotNull(message = "Please provide the stateCode")
	private String stateCode;

	@NotNull(message = "Please provide the stateCode")
	private String stateTaxCode;

	@NotNull(message = "taxDetails cannot be null")
	private Object taxComponent;

	private Boolean isActive;

}
