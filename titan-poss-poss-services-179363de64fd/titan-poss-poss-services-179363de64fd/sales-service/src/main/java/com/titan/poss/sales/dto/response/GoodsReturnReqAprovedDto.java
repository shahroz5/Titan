/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GoodsReturnReqAprovedDto {

	@NotNull
	private Boolean isCMGoldRate;
}
