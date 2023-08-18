/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.core.dto.LegacyCmDetailsDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.ItemDetailsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for item details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ItemDetailsResponseDto extends ItemDetailsDto {

	private String itemId; // cash memo details id

	private String binCode;

	private String binGroupCode;

	private Integer rowId;

	private String refTxnId;

	private String refTxnType;

	private JsonData inventoryWeightDetails;

	private JsonData measuredWeightDetails;

	private PriceDetailsDto priceDetails;

	private TaxCalculationResponseDto taxDetails;
	
	private LegacyCmDetailsDto legacyCmDetails;

	private String productGroupCode;

	private String productCategoryCode;

	private JsonData discountDetails;

	private BigDecimal inventoryStdValue;

	private BigDecimal inventoryStdWeight;

	private Boolean itemInStock;

	private String orderItemId;

	private JsonData itemDetails;
	
	private String pricingType;

	private BigDecimal stoneCaratWt;
	
	private BigDecimal otherStoneWt;
}
