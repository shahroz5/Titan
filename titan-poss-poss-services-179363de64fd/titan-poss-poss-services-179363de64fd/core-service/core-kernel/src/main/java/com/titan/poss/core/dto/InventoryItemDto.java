/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dto to get item inventory details with item and binGroup validations.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryItemDto {

	private String binCode;
	private String productGroupDescription;
	private String inventoryId;
	private String lotNumber;
	private BigDecimal karatage;
	private Short totalQuantity;
	private BigDecimal stdWeight;
	private BigDecimal unitWeight;
	private Object totalWeightDetails;
	private String productCategoryDescription;
	private String productGroupCode;
	private String productCategoryCode;
	private String itemCode;
	private String imageUrl;
	private String binGroupCode;
	private String itemDescription;
	private BigDecimal stdValue;
	private Date mfgDate;
	private Date stockInwardDate;
	private Boolean isHallmarked;
	private String requestType;
	private Short requestQuantity;
	private String itemDetails;
	
}
