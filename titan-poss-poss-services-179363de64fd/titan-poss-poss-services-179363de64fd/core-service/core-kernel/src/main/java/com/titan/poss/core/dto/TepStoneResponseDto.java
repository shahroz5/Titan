/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class TepStoneResponseDto {

	private TepExceptionDetailsResponseDto tepOfferDetails; // to be used for stone

	private BigDecimal deductionPercent; // used

	private String stoneCode;

	private String stoneTypeCode;

	private String stoneQuality;
}
