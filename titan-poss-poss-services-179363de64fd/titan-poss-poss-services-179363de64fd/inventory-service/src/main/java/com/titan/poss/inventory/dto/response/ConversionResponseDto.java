/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ConversionResponseDto {

	private String itemCode;
	private String productCategoryDesc;
	private String productCategoryCode;
	private String productType;
	private BigDecimal stoneValue;
	private BigDecimal stdWeight;
	private BigDecimal stdValue;
	private String complexityCode;
	private String lotNumber;
	private boolean isAutoApproved;
	private String binCode;
	private String imageURL;
	private String inventoryId;
	private String productGroupDesc;
	private String productGroupCode;
	private String weightUnit;
	private String currencyCode;
	private String itemDescription;
	private boolean studded;
	private List<ConversionResponseDto> childItems;

}
