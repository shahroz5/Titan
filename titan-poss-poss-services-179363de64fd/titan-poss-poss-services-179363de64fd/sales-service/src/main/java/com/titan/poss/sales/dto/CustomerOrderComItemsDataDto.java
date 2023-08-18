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
public class CustomerOrderComItemsDataDto {
  
	@JsonProperty("customer_name")
	private String customerName;
	
	@JsonProperty("mobileno")
	private String mobileNumber;
	
	@JsonProperty("com_order_number")
	private String comOrderNumber;
	
	@JsonProperty("com_order_date")
	private Date comOrderDate;
	
	@JsonProperty("store_code")
	private String storeCode;
	
	@JsonProperty("rso_name")
	private String rsoName; 
	
	@JsonProperty("is_occassion")
	private Boolean isOccassion; 
	
	@JsonProperty("special_occasion")
	private String specialOccasion;
	
	@JsonProperty("date_of_occasion")
	private Date dateOfOccasion;
	
	@JsonProperty("eceleste_flag")
	private Boolean ecelesteFlag;
	
	@JsonProperty("request_type")
	private String requestType;
	
	@JsonProperty("sub_type")
	private String subType;
	
	@JsonProperty("lot_number")
	private String lotNumber;
	
	@JsonProperty("cfa_code")
	private String cfaCode;
	
	@JsonProperty("is_dummy_code")
	private Boolean isDummyCode;
	
	@JsonProperty("quantity")
	private Short quantity;
	
	@JsonProperty("is_sizing")
	private Boolean isSizing;
	
	@JsonProperty("gold_rate")
	private BigDecimal goldRate;
	
	@JsonProperty("gold_charges")
	private BigDecimal goldCharges;
	
	@JsonProperty("making_charges")
	private BigDecimal makingCharges;
	
	@JsonProperty("stone_charges")
	private BigDecimal stoneCharges;
	
	@JsonProperty("total_value")
	private BigDecimal totalValue;
	
	@JsonProperty("gross_wt")
	private BigDecimal grossWt;
	
	@JsonProperty("wt_per_unit")
	private BigDecimal wtPerUnit;

	@JsonProperty("stone_wt")
	private BigDecimal stoneWt;
	
	@JsonProperty("net_weight")
	private BigDecimal netWeight;

	@JsonProperty("delivery_dt")
	private String deliveryDate;
	
	@JsonProperty("is_item_code_available")
	private Boolean isItemCodeAvailable;

	
	}
