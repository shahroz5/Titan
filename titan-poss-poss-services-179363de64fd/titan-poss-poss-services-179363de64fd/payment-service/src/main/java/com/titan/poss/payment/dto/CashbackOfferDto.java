/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CashbackOfferDto {

	@NotNull
	private Boolean isCashbackAmount;

	private List<CashbackOfferUpdateDto> updateOffers;

	private List<CashbackOfferAddDto> addOffers;

	private List<String> removeOffers;

}
