/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import lombok.Data;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Data
public class RuleFieldMasterDto {

	private String configType;
	private String fieldCode;
	private String description;
	private String fieldValidation;
	private Boolean isActive;
}
