/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * Discount details DTO class to capture other details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountOtherDetailsDto {

	private BigDecimal minPaymentPercent;

	private String itemId;

	private Boolean isPriceUpdate;

}
