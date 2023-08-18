/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocItemDto {


	private String itemCode;

	private BigDecimal stdWeight;

	private BigDecimal karat;

	
}
