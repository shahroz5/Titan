/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ExchangeUpdateItemResponseDto {

	private String configId;
	private String id;
	private String itemCode;
	private Boolean isExcluded;
}
