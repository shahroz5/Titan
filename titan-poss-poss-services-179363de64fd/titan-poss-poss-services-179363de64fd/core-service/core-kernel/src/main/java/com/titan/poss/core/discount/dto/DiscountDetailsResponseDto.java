/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountDetailsResponseDto {

	private BigDecimal discountValue;

	private List<DiscountValueDetails> discountValueDetails;

	private DiscountDetailsBaseDto discountConfigDetails;

	private RivaahGhsDiscountDto rivaahGhsDetails;
}
