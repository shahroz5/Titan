/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class OmniOrderCustomerCancelDto {
	private String orderNumber;
	private String shipmentNumber;
	private String status;
	private List<OmniOrderCancelItemsDto> omniOrderCancelItemsDto;

}
