/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class GepThemeRequestDto {

	private List<@PatternCheck(regexp = RegExConstants.THEME_CODE_REGEX) String> addThemes;
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX)String> removeThemes;
}
