/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.dto.request.json;

import java.math.BigDecimal;
import java.util.List;

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
public class ProductGroupConfig extends BaseFieldsValidator {

	@NotNull(message = "isEligibleForLoyaltyPoints cannot be null")
	private Boolean isEligibleForLoyaltyPoints;

	@NotNull(message = "printGuranteeCard cannot be null")
	private Boolean printGuranteeCard;

	@NotNull(message = "isGRNEnabled cannot be null")
	private Boolean isGRNEnabled;

	@NotNull(message = "isConversionEnabled cannot be null")
	private Boolean isConversionEnabled;

	@NotNull(message = "isBestGoldRateEnabled cannot be null")
	private Boolean isBestGoldRateEnabled;

	private Boolean isHallmarked;
	
	private BigDecimal hallmarkingExcludeGrams;
	
	private List<BigDecimal> hallmarkingExcludeKarat;
	
	@NotNull(message = "isAllowedForTCS cannot be null")
	private Boolean isAllowedForTCS;

	private Boolean isSolitaireStudded;
	
	
	
}
