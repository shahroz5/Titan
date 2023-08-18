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
public class MaterialDto {
	
	@JsonProperty("item_serial_no")
	private BigInteger itemSerialNo;
	
	@JsonProperty("material_lineno")
	private BigInteger materialLineNo;
	
	@JsonProperty("material_code")
	private String materialCode;
	
	@JsonProperty("material_wt")
	private BigDecimal materialWt;
	
	@JsonProperty("material_qty")
	private Integer materialQty;

}
