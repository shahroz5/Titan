/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class LinkDiscountResponseDto {

	private String id;

	private String srcDiscountCode;

	private String destDiscountCode;

	private Boolean isDeletable;
	
	private Boolean isActive;

}
