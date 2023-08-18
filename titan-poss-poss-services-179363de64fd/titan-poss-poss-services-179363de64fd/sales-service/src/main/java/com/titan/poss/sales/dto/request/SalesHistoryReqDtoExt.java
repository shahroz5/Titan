/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto.request;

import javax.validation.constraints.Positive;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class SalesHistoryReqDtoExt extends SalesHistoryReqDto{

	@Positive(message = "Doc No. should be more than 0")
	private Integer refDocNo;
}
