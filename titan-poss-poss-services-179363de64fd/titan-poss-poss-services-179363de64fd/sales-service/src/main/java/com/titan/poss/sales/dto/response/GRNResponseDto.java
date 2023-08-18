/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class GRNResponseDto extends GRNInitateResponseDto {

	private String processId;
	private String cancelType;
	private String reasonForCancellation;

	private BigDecimal focRecoverValue;

}
