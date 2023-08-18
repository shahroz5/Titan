package com.titan.poss.core.dto;
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/

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
public class StnDto {
	
	@JsonProperty("stmno")
	private Integer stnNo;
	
	@JsonProperty("location")
	private String location;
	
	@JsonProperty("stmdate")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyyMMdd")
	private Date stmDate;
	
	@JsonProperty("factory_code")
	private String factoryCode;
	
	@JsonProperty("product_group")
	private Integer productgroup;
	
	@JsonProperty("fiscal_year")
	private Integer fiscalYear;
	
	@JsonProperty("gold_rate")
	private Double goldRate;
	
	@JsonProperty("ship_qty")
	private Integer shipQty;
	
	@JsonProperty("ship_qty2")
	private BigDecimal shipQty2;
	
	@JsonProperty("stmvalue")
	private BigDecimal stmValue;
	
	@JsonProperty("carrier_name")
	private String carrierName;
	
	@JsonProperty("docketno")
	private Integer docketNo;
	
	@JsonProperty("created_by")
	private String createdBy;
	
	@JsonProperty("created_date")
	private Date createdDate;
}
