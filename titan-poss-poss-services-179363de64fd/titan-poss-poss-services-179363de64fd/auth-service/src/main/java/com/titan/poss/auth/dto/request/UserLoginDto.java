/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.auth.dto.request;

import javax.validation.constraints.NotBlank;

import com.titan.poss.auth.constants.HardCodedConstants;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UserLoginDto {

	@ApiModelProperty(example = HardCodedConstants.DEFAULT_BRANDCODE)
	@NotBlank
	private String brandCode;

	private String hostName = "";
}
