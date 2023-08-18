/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.FocItemDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItemDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX, nullCheck = true)
	private String productGroupCode;

	private List<FocItemDetailsDto> focItemDetails;

}
