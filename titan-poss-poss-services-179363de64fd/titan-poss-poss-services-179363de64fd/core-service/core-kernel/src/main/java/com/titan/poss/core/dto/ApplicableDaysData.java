/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ApplicableDaysData implements Serializable{

	private static final long serialVersionUID = 1L;

	@NotNull(message = "isVariableDay cannot be null")
	private Boolean isVariableDay;
	
	@NotNull(message = "isSingleDay cannot be null")
	private Boolean isSingleDay;
	
	
}
