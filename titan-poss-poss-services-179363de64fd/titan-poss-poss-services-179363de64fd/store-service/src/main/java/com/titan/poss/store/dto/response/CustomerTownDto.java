/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dto.response;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomerTownDto {
	private Integer townCode;
	private String description;
	private String stateCode;
	private String stateName;
	private Boolean isActive;
}
