/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import com.titan.poss.config.dto.FocSchemeDetailBaseDto;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class FocSchemeDetailUpdateDto extends FocSchemeDetailBaseDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String schemDetailsId;

}
