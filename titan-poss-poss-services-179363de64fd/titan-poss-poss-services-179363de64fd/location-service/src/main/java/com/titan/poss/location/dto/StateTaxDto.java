/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto;


import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StateTaxDto {

	private Set<@Valid AddStateTaxMappingDto> addTaxes;

	private Set<@PatternCheck(regexp = RegExConstants.TAX_CLASS_CODE_REGEX, nullCheck = true) String> removetaxes;

}
