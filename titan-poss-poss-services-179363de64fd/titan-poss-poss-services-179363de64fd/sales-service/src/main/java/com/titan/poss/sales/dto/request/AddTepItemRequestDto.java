/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.BaseTepItemDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AddTepItemRequestDto extends BaseTepItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String cashMemoDetailsId;

	@NotNull(message = "discountDetails cannot be null")
	private JsonData discountDetails;

	private JsonData itemDetails;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String inventoryId;
}
