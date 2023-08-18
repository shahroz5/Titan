/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PriceDetailsDto {
	BigDecimal netWeight;
	Boolean isUcp;
	private MetalPriceDetailsDto metalPriceDetails;
	private StonePriceDetailsDto stonePriceDetails;
	private MakingChargeDetailsDto makingChargeDetails;
	private MaterialPriceDetailsDto materialDetails;
	private ItemHallmarkDetailsDto itemHallmarkDetails;
	private Boolean printGuranteeCard;
	private String itemTypeCode;
	private String discountRecovered;
}
