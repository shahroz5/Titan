/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TepDiscountDetailsDto extends BaseFieldsValidator {

	@NotNull(message = "isCoinOfferDiscountEnabled cannot be null")
	private Boolean isCoinOfferDiscountEnabled;
}
