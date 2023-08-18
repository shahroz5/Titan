/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.response;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ExchangeRateDto {

	@NotNull(message = "Please provide the id")
	private String id;

	@NotNull(message = "Please provide the fromCurrency")
	private String fromCurrency;

	@NotNull(message = "Please provide the toCurrency")
	private String toCurrency;

	@NotNull(message = "Please provide the buyingRate")
	private BigDecimal buyingRate;

	@NotNull(message = "Please provide the sellingRate")
	private BigDecimal sellingRate;
}
