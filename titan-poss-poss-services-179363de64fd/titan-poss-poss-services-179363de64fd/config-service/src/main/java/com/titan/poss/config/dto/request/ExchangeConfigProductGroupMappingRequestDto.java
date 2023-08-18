/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.config.dto.AddGepRangeDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class ExchangeConfigProductGroupMappingRequestDto {

	// only for config type TEP_ITEM,GEP_ITEM
	private Set<@Valid AddExchangeConfigProductDto> addProductGroups;

	// only for config type TEP_ITEM,GEP_ITEM
	private Set<@Valid UpdateExchangeConfigProductDto> updateProductGroups;
	
	// only for config type GEP_ITEM
	private Set<@Valid AddExchangeConfigProductDto> updateGepProductGroups;

	// only for config type TEP_ITEM,GEP_ITEM
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProductGroups;

	// only for config type GEP_ITEM
	private Set<@Valid AddGepRangeDto> addRanges;
	
	// only for config type GEP_ITEM
	private Set<@Valid AddGepRangeDto> updateRanges;

	// only for Cut Piece TEP
	private Set<@Valid AddCutPieceTepRequestDto> addProductCategories;

	// only for Cut Piece TEP
	private Set<@Valid UpdateCutPieceTepRequestDto> updateProductCategories;

	// only for Cut Piece TEP
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProductCategories;

	// only for Rivaah gep purity
	private RivaahExchangeConfigDto rivaahExchangeConfigDto;
}
