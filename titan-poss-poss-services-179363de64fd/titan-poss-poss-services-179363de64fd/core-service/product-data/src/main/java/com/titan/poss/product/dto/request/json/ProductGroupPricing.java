/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.dto.request.json;

import javax.validation.constraints.NotNull;

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
public class ProductGroupPricing extends BaseFieldsValidator {

	@NotNull(message = "isGoldPriceMandatory cannot be null")
	private Boolean isGoldPriceMandatory;

	@NotNull(message = "isSilverPriceMandatory cannot be null")
	private Boolean isSilverPriceMandatory;

	@NotNull(message = "isPlatinumPriceMandatory cannot be null")
	private Boolean isPlatinumPriceMandatory;

	@NotNull(message = "isStonePriceMandatory cannot be null")
	private Boolean isStonePriceMandatory;

	@NotNull(message = "isMakingChargeMandatory cannot be null")
	private Boolean isMakingChargeMandatory;

	@NotNull(message = "isAllowedForDigiGoldMandatory cannot be null")
	private Boolean isAllowedForDigiGoldMandatory;
}
