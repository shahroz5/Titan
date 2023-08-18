/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
public class MissingFieldCheckDto {

	String value;
	String fieldName;
}
