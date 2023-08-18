/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CMVariantDto {
	

	private String locationCode;
	

	private Integer docNo;
	

	private Short fiscalYear;
	
	@JsonProperty("lineItemNo")
	private Integer rowId;
	
	private BigDecimal unitValue;
	
	private BigDecimal totalValue;
	
	private Double goldPrice;
	
	@JsonProperty("quantity")
	private Short totalQuantity;
	
	@JsonProperty("makingCharges")
	private BigDecimal makingCharges;

	@JsonProperty("discount")
	private BigDecimal totalDiscount;
	
	private BigDecimal totalTax;
	
	@JsonProperty("batchDate")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date docDate;
	
	private BigDecimal stoneWeight;
	
	private Double stoneValue;
	
	private String itemCode;
	
	private String remarks;
	
	private String binCode;
	
	private Double tax1;
	
	private Double tax2;
	
	private String employeeCode;
	
	@JsonProperty("actualWeight")
	private BigDecimal inventoryStdWeight;
	
	@JsonProperty("measuredWeight")
	private BigDecimal totalWeight;
	
	private String taxType1;
	
	private String taxType2;
	
	private String lotNumber;
	
	private BigDecimal wastagePercentage;
	
	private Double wastageCharge;
	
	private Double goldRate;
	
	private BigDecimal paymentByCash;
	
	private Double otherChanges;
	
	private Integer encirclePoints;
	
	private Double platinumRate;
	
	private Double silverRate;
	
	private Double platinumPrice;
	
	private Double silverPrice;
	
	private BigDecimal goldWeight;
	
	private Double goldMakingCharges;
	
	private Double goldWastageCharges;
	
	private BigDecimal platinumWeight;
	
	private Double platinumMakingCharges;
	
	private Double platinumWastageCharges;
	
	private BigDecimal silverWeight;
	
	private Double silverMakingCharges;
	
	private Double silverWastageCharges;
	
	private BigDecimal otherMaterialWeight;
	
	private Float cessPercentage;
	
	private  Double cessValue;
	
	private BigDecimal preDiscountTotalValue;
	
	private BigDecimal actualGoldWeight;
	
	private BigDecimal actualPlatinumWeight;
	
	private BigDecimal actualSilverWeight;
	
	private BigDecimal actualOtherMaterialWeight;
	
	private Short noOfItemsReturned;
	
	private Boolean isTEPDiscountRecoveryAllowed;
	
	private Boolean isFullValueTEPDiscountRecoveryAllowed; 
	
	private String legacyCmDetails;
	
//	private BigDecimal discount;
	
	private BigDecimal billLevelDiscount;
	
	private BigDecimal ghsDiscount;
	
	private BigDecimal ghsVoucherDiscount;
	
	private BigDecimal gepExchangeDiscount;
	
	private BigDecimal digiGoldDiscount;
	
	private Boolean isUCPDiscountPercentage;
	
	private Boolean isF1DiscountPercentage;
	
	private Boolean isF2DiscountPercentage;
	
	private BigDecimal loyaltyAmtReversed;
	
	private BigDecimal encirclePointValue;
	
	
	

	private Boolean isHallMarking;
	private BigDecimal hmCharges;
	private Integer hmQuantity;
	private BigDecimal hmgst;

}
