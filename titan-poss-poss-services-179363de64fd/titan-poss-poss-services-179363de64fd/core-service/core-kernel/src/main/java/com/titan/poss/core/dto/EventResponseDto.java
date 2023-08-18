/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class EventResponseDto {

	private String messageMileStone;
	
	private String messageTrident;

	private Boolean isSuccessMileStone;

	private Boolean isSuccessTrident;
}
