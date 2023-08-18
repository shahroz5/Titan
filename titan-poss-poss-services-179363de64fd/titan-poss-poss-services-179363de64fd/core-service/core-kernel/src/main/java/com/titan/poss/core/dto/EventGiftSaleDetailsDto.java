/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EventGiftSaleDetailsDto {

	private String instrumentNo;

	private BigDecimal totalValue;

	private String taxDetails;

	private String giftCode;

	private String giftType;

	private BigDecimal finalValue;

}
