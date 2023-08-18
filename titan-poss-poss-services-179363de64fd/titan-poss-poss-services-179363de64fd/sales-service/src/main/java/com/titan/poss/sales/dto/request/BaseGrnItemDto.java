/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.ReturnableItemsDto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class BaseGrnItemDto {

	@ApiModelProperty(position = 1)
	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String refTxnId;

	@ApiModelProperty(position = 2)
	@NotNull
	@Size(min = 1)
	
	private List< ReturnableItemsDto> items;
	
//	@ApiModelProperty(position = 3)
//	@NotNull
//	private Integer quantity;

}
