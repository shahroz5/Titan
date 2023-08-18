/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CustomerOrderDetailsTempDto {
	
	@JsonProperty("customermobileno")
	private String customerMobileNo;
	
	@JsonProperty("customername")
	private String customerName;
	
	@JsonProperty("itemcode")
	private String itemCode;
	
	@JsonProperty("grosswt")
	private BigDecimal grossWeight;
	
	private Short quantity;
	
	private String status;
	
	@JsonProperty("comorderno")
	private String comOrderNo;
	
	@JsonProperty("comorderdatetime")
	private Date comOrderDateTime;
	
	private String autostn;
	
	@JsonProperty("requesttype")
	private String requestType;
	
	@JsonProperty("requestbtq")
	private String requestBtq;
	
	@JsonProperty("requestby")
	private String requestBy;
	
	@JsonProperty("deliverydatetime")
	private Date deliveryDateTime;
	
	@JsonProperty("ordervalue")
	private BigDecimal orderValue;
	
	@JsonProperty("lot_no")
	private String lotNumber;
	
		
}
