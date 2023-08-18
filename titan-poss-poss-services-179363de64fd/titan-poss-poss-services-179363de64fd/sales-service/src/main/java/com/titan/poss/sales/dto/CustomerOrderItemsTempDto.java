/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */


@Data
public class CustomerOrderItemsTempDto {

	private List<CustomerOrderDetailsTempDto> items;

}