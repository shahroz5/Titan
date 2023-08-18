/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.CNLiteDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class CnGrfLiteDto extends CNLiteDto {

	// frozen rate details
	JsonData frd;
	String id;
}
