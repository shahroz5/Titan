/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.dto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PincodeDto {

	private String id;

	private String pinCode;

	private String cachementArea;

	private String townName;

	private String stateName;

	private String countryCode;

	private Boolean isActive;
}
