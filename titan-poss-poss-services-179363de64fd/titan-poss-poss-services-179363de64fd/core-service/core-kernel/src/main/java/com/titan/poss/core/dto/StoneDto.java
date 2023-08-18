/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StoneDto {
	
	@JsonProperty("item_serial_no")
	private BigInteger itemSerialNo;

	@JsonProperty("stone_lineno")
	private BigInteger stoneLineNo;

	@JsonProperty("stone_code")
	private String stoneCode;

	@JsonProperty("stone_wt")
	private BigDecimal stnWt;

	@JsonProperty("stone_qty")
	private Integer stnQty;

	@JsonProperty("product_group")
	private String productGroup;
}
