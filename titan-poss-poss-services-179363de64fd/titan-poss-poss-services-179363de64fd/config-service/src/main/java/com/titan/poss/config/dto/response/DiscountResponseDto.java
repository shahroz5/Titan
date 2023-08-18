/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.util.Date;

import com.titan.poss.core.discount.dto.DiscountDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountResponseDto extends DiscountDto {

	private String id;

	private Boolean isPublishPending;

	private Date publishTime;

	private String requestStatus;

	private String typeOfRequest;
	
	private String workflowProcessId;
}
