/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class RangeResponseDto {

	private String id;

	private Integer rowId;

	private BigDecimal fromRange;

	private BigDecimal toRange;

	private Boolean isActive;
}
