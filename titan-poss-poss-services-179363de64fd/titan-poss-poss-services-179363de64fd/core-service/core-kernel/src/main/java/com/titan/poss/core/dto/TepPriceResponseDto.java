/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class TepPriceResponseDto {

	private String itemCode;
	private String lotNumber;
	private String productGroupCode;
	private String productGroupDesc;
	private Short itemQuantity;
	private String currencyCode;
	private String productCategoryCode;
	private String productCategoryDesc;
	private BigDecimal billedWeight;
	private BigDecimal netWeight;
	private BigDecimal stdWeight;
	private MetalPriceDetailsDto metalPriceDetails;
	private StonePriceDetailsDto stonePriceDetails;
	private MaterialPriceDetailsDto materialDetails;
	private MakingChargeDetailsDto makingChargeDetails;
	private BigDecimal finalValue;
	private BigDecimal UCPValue;
	private BigDecimal deductionAmount;
	private BigDecimal discountRecovered;
	private String itemTypeCode;
	private List<ItemLotStoneDto> stones;
	private Boolean isUCPCMValue;
	private Boolean iscashMemoAvailable;
	private Boolean isExceptionValue;
	private BigDecimal refundDeductionAmount;
	private BigDecimal measuredWeight;
	private BigDecimal refundDeductionPercent;
	private BigDecimal cmUnavailableDeductionPercent;
	private BigDecimal cmUnavailableDeductionAmount;
	private BigDecimal fvtDeductionPercent;
	private Boolean isUCPproduct;
	private String tepType;
	private Integer rowId;
	private Integer cmDocNo;
	private Short cmFiscalYear;
	private String cmLocationCode;
	private BigDecimal hallMarkingCharges;
	private String customerType;
	private JsonData tepExceptionDetails;
	private BigDecimal fullvalueItemFinalValue;
	private BigDecimal itemFinalValue;
}
