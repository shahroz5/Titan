/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * Base DTO to carry Stock Item Data
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public abstract class BaseStockItemDto {

	private String id;
	private String itemCode;
	private String lotNumber;
	private Date mfgDate;
	private String productCategory;
	private String productGroup;
	private String productCategoryDesc;
	private String productGroupDesc;
	private String binCode;
	private String binGroupCode;
	private BigDecimal stdValue;
	private BigDecimal stdWeight;
	private String currencyCode;
	private String weightUnit;
	private String status;
	@JsonProperty("imageURL")
	private String imageURL;
	private Object itemDetails;
}
