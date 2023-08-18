/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class InvoiceDto {
	
	@JsonProperty("to_Sub_inv")
	private String toSubInv;

	@JsonProperty("L3_btq_code")
	private String l3BtqCode;
	
	@JsonProperty("invoice_number")
	private String invoiceNumber;

	@JsonProperty("invoice_date")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyyMMdd")
	private Date invoiceDate;

	@JsonProperty("fiscal_year")
	private Integer fiscalYear;

	@JsonProperty("ship_qty")
	private Integer shipQty;

	@JsonProperty("ship_wt")
	private BigDecimal shipWt;

	@JsonProperty("invoice_value")
	private BigDecimal invoiceValue;

}
