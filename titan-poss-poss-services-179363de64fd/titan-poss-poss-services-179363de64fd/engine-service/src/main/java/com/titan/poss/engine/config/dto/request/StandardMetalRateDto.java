/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.dto.request;

import com.titan.poss.core.dto.BusinessDateDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StandardMetalRateDto extends BusinessDateDto {

	Boolean isRetryAttempted;
}
