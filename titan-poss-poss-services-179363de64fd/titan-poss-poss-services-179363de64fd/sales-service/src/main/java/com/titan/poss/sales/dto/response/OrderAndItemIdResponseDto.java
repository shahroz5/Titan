/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO for Order and it's Item Id's.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderAndItemIdResponseDto extends OrderResponseDto {

	List<String> itemIdList;

}
