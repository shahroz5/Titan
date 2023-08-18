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
public class TaxDto {
	
	@JsonProperty("item_serial_no")
	private BigInteger itemSerialNo;
	
	@JsonProperty("tax_line_sno")
	private Integer taxLineSno;
	
	@JsonProperty("tax_type")
	private String taxType;
	
	@JsonProperty("indent")
	private String indent;
	
	@JsonProperty("tax_perc")
	private BigDecimal taxPerc;
	
	@JsonProperty("tax_amt")
	private BigDecimal taxAmt;
	
	@JsonProperty("tax_src_amt")
	private BigDecimal taxSrcAmt;
	
	@JsonProperty("product_group")
	private String productGroup;
}
