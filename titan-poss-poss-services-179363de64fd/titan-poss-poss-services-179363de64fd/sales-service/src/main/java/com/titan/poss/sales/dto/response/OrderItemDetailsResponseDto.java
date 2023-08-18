/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.ItemDetailsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO for Order Item details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderItemDetailsResponseDto extends ItemDetailsDto {

	private String itemId; // order details Id

	private String binCode;

	private Integer rowId;

	private JsonData inventoryWeightDetails;

	private JsonData measuredWeightDetails;// Need confirmation from BA

	private PriceDetailsDto priceDetails;

	private TaxCalculationResponseDto taxDetails;

	private String productGroupCode;

	private String productCategoryCode;

	private JsonData discountDetails;

	private JsonData itemDetails;

	private JsonData minPaymentDetails;
	
	private String comOrderNumber;
	
	private Boolean isAutoStn;
	
	private Date deliveryDate;
	
	private BigDecimal orderValue;
	
	private String requestType;
	
	private BigDecimal grossWeight;
	
	private Date orderDate;
	
	private String requestedBy;
	
	private String requestBtq;
	
	private Boolean isOccassion;
	
	private String specialOccasion;
	
	private Date dateOfOccasion;
	
	private Boolean ecelesteFlag;
	
	private String subType;
	
	private Boolean isSizing;
	
	private BigDecimal wtPerUnit;
	
	private String pricingType;
	
	private BigDecimal otherStoneWt;

	private String hsnCode;
}
