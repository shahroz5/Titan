/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class OmniOrderCancelItemsDto {
	private Integer lineNumber;
	private String itemCode;
	private String lotNumber;
	private String remarks;
	private Integer quantity;
}
