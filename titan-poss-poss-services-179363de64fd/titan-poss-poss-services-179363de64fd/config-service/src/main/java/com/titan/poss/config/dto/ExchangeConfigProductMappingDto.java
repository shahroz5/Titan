/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.math.BigDecimal;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ExchangeConfigProductMappingDto {
	private String id;
	private String productGroupCode;
	private String rangeId;
	private BigDecimal percentValue;
	private JsonData configDetails;
	private String productCategoryCode;
}
