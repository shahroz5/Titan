/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for existing item details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExistingItemDetailsDto {

	private String itemId;
	private String itemCode;
	private String lotNumber;
	private String inventoryId;
	private Integer docNo;
	private String txnType;
	private String subTxnType;
	private String id;
	private String status;

}
