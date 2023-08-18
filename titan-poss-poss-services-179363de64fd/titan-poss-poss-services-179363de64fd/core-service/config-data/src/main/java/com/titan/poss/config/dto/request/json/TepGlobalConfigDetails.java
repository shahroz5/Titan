/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TepGlobalConfigDetails extends BaseFieldsValidator {

	@NotNull(message = "maxFlatTepExchangeValue cannot be null")
	@PositiveOrZero(message = "maxFlatTepExchangeValue cannot be less than 0")
	@Digits(integer = 9, fraction = 2, message = "maxFlatTepExchangeValue valid till 3 decimal places only")
	private BigDecimal maxFlatTepExchangeValue;
}
