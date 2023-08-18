/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to get cashback utilized.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CashbackUtilizedDto {

	private String offerId;
	private Integer usageCount;

}
