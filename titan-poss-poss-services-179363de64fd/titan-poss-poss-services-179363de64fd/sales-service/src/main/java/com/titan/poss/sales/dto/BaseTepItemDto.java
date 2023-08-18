/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.BaseStoneDetails;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class BaseTepItemDto {

	@NotNull(message = "isSaleable cannot be null")
	private Boolean isSaleable;

	@NotNull(message = "unitValue cannot be null")
	@Positive(message = "unitValue should be more than 0")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "unitValue valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal unitValue;

	@NotNull(message = "totalValue cannot be null")
	@Positive(message = "totalValue should be more than 0")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "totalValue valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;

	@NotNull(message = "finalValue cannot be null")
	@Positive(message = "finalValue should be more than 0")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "finalValue valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal finalValue;

	@Positive(message = "quantity should be more than 0")
	@NotNull(message = "quantity cannot be null")
	private Short quantity;

	@NotNull(message = "unitWeight cannot be null")
	@Positive(message = "unitWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "unitWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal unitWeight;

	@NotNull(message = "totalWeight cannot be null")
	@Positive(message = "totalWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "totalWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalWeight;

	private List<@Valid BaseStoneDetails> stonesDetails;
}
