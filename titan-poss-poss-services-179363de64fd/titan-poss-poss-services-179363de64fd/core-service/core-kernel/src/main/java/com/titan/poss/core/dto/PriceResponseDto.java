/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PriceResponseDto {

	String itemCode;
	String lotNumber;
	String productGroupCode;
	String productGroupDesc;
	String binCode;
	String inventoryId;
	String productDesc;
	Short itemQuantity;
	String priceGroup;
	String complexityCode;
	String currencyCode;
	String productCategoryCode;

	BigDecimal stdWeight;

	PriceDetailsDto priceDetails;

	BigDecimal finalValue;

	// following fields are added to check the validations before sending response
	// to UI
	Boolean isGoldPriceMandatory;
	Boolean isSilverPriceMandatory;
	Boolean isPlatinumPriceMandatory;
	Boolean isStonePriceMandatory;
	Boolean isMakingChargeMandatory;

	private String itemTypeCode;

	// for AB
	private String pricingType;
	private BigDecimal priceFactor;
	private BigDecimal makingChargeMarkupFactor;
	private MakingChargeMarginDetailsDto makingChargeMarginDetails;
	private BigDecimal marketUcpMarkupFactor;

	private Boolean ignoreUcpRecalculate;
	Boolean checkInventory;
	Boolean isCOMPrice;
}
