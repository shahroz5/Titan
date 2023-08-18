/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.sales.dto.ItemInvDetailsDto;

import lombok.Data;

/**
 * DTO for inventory update check
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class SalesItemDto {

	private String id;// CM or AB details id
	private String itemCode;
	private String lotNumber;
	private String inventoryId;
	private String productGroupCode;
	private Short totalQuantity;
	private String binCode;
	private String binGroupCode;
	private BigDecimal inventoryWeight;
	private Boolean isHallmarked; // used to fetch only hallmarked coins when true. If 'false', then any coin can
	// be picked irrespective of hallmark.
	Map<String, ItemInvDetailsDto> itemInvDetails;
}
