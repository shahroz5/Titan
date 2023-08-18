/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

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
@EqualsAndHashCode
@NoArgsConstructor
public class StateTaxMappingCreateDto {

	private String stateName;

	private String stateCode;

	private Object taxComponent;

	private String stateTaxCode;

	private Boolean isActive;
}
