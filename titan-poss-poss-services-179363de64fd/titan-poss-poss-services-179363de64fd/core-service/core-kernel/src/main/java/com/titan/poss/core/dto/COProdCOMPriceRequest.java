/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class COProdCOMPriceRequest extends PriceRequest {
	
	//dummy itemcode 
	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

	//to be set to false
	private Boolean checkInventory;

	//is this needed as the product will not be there ,, might impact in logic if we remove this field
	private Short measuredQuantity;

	//no id 
	private String inventoryId;
	
	//can be set to TRUE in case of PROD-COM orders.
	private Boolean isComPrice;
	
	private BigDecimal goldRate;
	
	private BigDecimal goldCharges;
	
	private BigDecimal makingCharges;
	
	private BigDecimal stoneCharges;
	
	private BigDecimal wtPerUnit;
	
	private BigDecimal stoneWt;

	private BigDecimal netWeight;

	private Boolean isItemCodeAvailable;
	
}
